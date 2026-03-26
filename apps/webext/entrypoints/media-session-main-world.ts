import { jongmyoDebug } from "../src/debug";

// this is horrible i am so sorry

export default defineUnlistedScript(() => {
  const tag = "[jongmyo:mediaSession]";
  const MSG_SOURCE = "jongmyo:media-session";
  const MEDIA_EVENTS = [
    "timeupdate",
    "seeked",
    "seeking",
    "durationchange",
    "loadedmetadata",
    "play",
    "playing",
    "pause",
    "ratechange",
    "ended",
  ] as const;

  const ms = navigator.mediaSession;
  if (!ms) {
    console.warn(tag, "navigator.mediaSession missing");
    return;
  }

  let lastMetadata: MediaMetadata | null = null;
  let lastPlaybackState: MediaSessionPlaybackState = "none";
  let lastPosition: MediaPositionState | null = null;
  let positionSetAtMs = 0;
  let tickId: ReturnType<typeof setInterval> | undefined;
  const hookedMedia = new Set<HTMLMediaElement>();
  let mediaEmitRaf = 0;

  function mediaElementsInTree(root: ParentNode): HTMLMediaElement[] {
    const out: HTMLMediaElement[] = [];
    root.querySelectorAll("video, audio").forEach((el) => {
      if (el instanceof HTMLVideoElement || el instanceof HTMLAudioElement) {
        out.push(el);
      }
    });
    root.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot) out.push(...mediaElementsInTree(el.shadowRoot));
    });
    return out;
  }

  /** Single pass: best element for timing + whether any HTML media is actively playing. */
  function scanMedia(): {
    timing: { currentSec: number; durationSec: number } | null;
    anyPlaying: boolean;
  } {
    const cands = [
      ...new Set([...hookedMedia, ...mediaElementsInTree(document)]),
    ];
    let best: HTMLMediaElement | null = null;
    let bestScore = -1;
    let anyPlaying = false;
    for (const el of cands) {
      const d = el.duration;
      const okDur = Number.isFinite(d) && d > 0;
      if (!el.paused && !el.ended && okDur) anyPlaying = true;
      if (!okDur) continue;
      const active = !el.paused && !el.ended;
      const score = (active ? 1e9 : 0) + Math.min(d, 1e6);
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }
    return {
      timing: best
        ? { currentSec: best.currentTime, durationSec: best.duration }
        : null,
      anyPlaying,
    };
  }

  function toMs(currentSec: number, durationSec: number) {
    const durationMs = Math.max(0, Math.round(durationSec * 1000));
    let currentMs = Math.max(0, Math.round(currentSec * 1000));
    if (durationMs > 0) currentMs = Math.min(currentMs, durationMs);
    return { currentMs, durationMs };
  }

  function hookMediaElement(el: HTMLMediaElement) {
    if (hookedMedia.has(el)) return;
    hookedMedia.add(el);

    const bump = () => {
      if (mediaEmitRaf) return;
      mediaEmitRaf = requestAnimationFrame(() => {
        mediaEmitRaf = 0;
        emit("event");
      });
    };

    for (const ev of MEDIA_EVENTS) {
      el.addEventListener(ev, bump, { passive: true });
    }
    el.addEventListener(
      "emptied",
      () => {
        hookedMedia.delete(el);
        bump();
      },
      { passive: true },
    );
  }

  function installMediaHooks() {
    const origPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement, ...a) {
      hookMediaElement(this);
      return Reflect.apply(origPlay, this, a) as Promise<void>;
    };

    const OrigAudio = window.Audio;
    window.Audio = new Proxy(OrigAudio, {
      construct(T, args, nt) {
        const el = Reflect.construct(T, args, nt) as HTMLAudioElement;
        hookMediaElement(el);
        return el;
      },
    }) as typeof Audio;

    const origCE = Document.prototype.createElement;
    Document.prototype.createElement = function (
      this: Document,
      tagName: string,
      options?: string | ElementCreationOptions,
    ): HTMLElement {
      const el = Reflect.apply(origCE, this, [tagName, options] as Parameters<
        typeof origCE
      >);
      if (el instanceof HTMLMediaElement) hookMediaElement(el);
      return el;
    };

    setInterval(() => {
      mediaElementsInTree(document).forEach(hookMediaElement);
    }, 4000);
  }

  function buildPayload(scan: ReturnType<typeof scanMedia>) {
    const md = lastMetadata;
    const art = md?.artwork?.[0]?.src ?? "";
    const playing = lastPlaybackState === "playing" || scan.anyPlaying;

    const durSession = lastPosition?.duration ?? 0;
    const useSession = durSession > 0 && Number.isFinite(durSession);

    let currentMs: number;
    let durationMs: number;

    if (useSession) {
      const rate = lastPosition?.playbackRate ?? 1;
      let posSec = lastPosition?.position ?? 0;
      if (lastPlaybackState === "playing" && positionSetAtMs > 0) {
        posSec += ((Date.now() - positionSetAtMs) / 1000) * rate;
      }
      ({ currentMs, durationMs } = toMs(posSec, durSession));
    } else if (scan.timing) {
      ({ currentMs, durationMs } = toMs(
        scan.timing.currentSec,
        scan.timing.durationSec,
      ));
    } else {
      currentMs = 0;
      durationMs = 0;
    }

    return {
      meta: {
        source: document.location.hostname || "web",
        url: document.location.href,
        image: art,
      },
      title: md?.title ?? "",
      artist: md?.artist ?? "",
      album: md?.album ?? "",
      progress: {
        playing,
        current: currentMs,
        duration: durationMs > 0 ? durationMs : 1,
      },
    };
  }

  function emit(reason: "event" | "tick" = "event") {
    const scan = scanMedia();
    if (lastPlaybackState === "playing" || scan.anyPlaying) {
      if (tickId === undefined) {
        tickId = setInterval(() => emit("tick"), 1000);
      }
    } else if (tickId !== undefined) {
      clearInterval(tickId);
      tickId = undefined;
    }

    const payload = buildPayload(scan);
    jongmyoDebug(
      "mediaSession",
      reason,
      payload.title,
      payload.progress.playing,
      `${payload.progress.current}/${payload.progress.duration}`,
    );
    try {
      window.postMessage(
        { source: MSG_SOURCE, type: "nowPlaying", payload },
        "*",
      );
    } catch (err) {
      console.warn(tag, "postMessage failed", err);
    }
  }

  const proxy = new Proxy(ms, {
    get(target, prop, _receiver) {
      const value = Reflect.get(target, prop, target);
      if (prop === "setPositionState" && typeof value === "function") {
        return (state?: MediaPositionState | null) => {
          const r = Reflect.apply(
            value as (s?: MediaPositionState | null) => void,
            target,
            [state],
          );
          if (state == null) {
            lastPosition = null;
            positionSetAtMs = 0;
          } else {
            lastPosition = { ...state };
            positionSetAtMs = Date.now();
          }
          emit("event");
          return r;
        };
      }
      if (typeof value === "function") {
        return (...args: unknown[]) =>
          Reflect.apply(value as (...a: unknown[]) => unknown, target, args);
      }
      return value;
    },
    set(target, prop, value, _receiver) {
      if (prop === "metadata" && value && typeof value === "object") {
        lastMetadata = value as MediaMetadata;
      }
      if (prop === "playbackState" && typeof value === "string") {
        lastPlaybackState = value as MediaSessionPlaybackState;
      }
      const ok = Reflect.set(target, prop, value, target);
      if (prop === "metadata" || prop === "playbackState") emit("event");
      return ok;
    },
  });

  installMediaHooks();

  try {
    Object.defineProperty(navigator, "mediaSession", {
      configurable: true,
      enumerable: true,
      get: () => proxy,
    });
  } catch (err) {
    console.warn(tag, "could not shadow navigator.mediaSession", err);
    return;
  }

  try {
    lastMetadata = ms.metadata;
    lastPlaybackState = ms.playbackState;
  } catch {
    /* ignore */
  }

  mediaElementsInTree(document).forEach(hookMediaElement);

  jongmyoDebug("mediaSession", "initialized");
  emit("event");
});
