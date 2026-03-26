import {
  applyNowPlayingEnrichment,
  enrichmentFromSoundcloudPostMessage,
  type NowPlayingEnrichment,
  type NowPlayingState,
  parseNowPlayingState,
  safeParseSoundcloudEnricherPostMessage,
} from "@jongmyo/protocol";

const FROM_MEDIA = "jongmyo:media-session";
const FROM_SOUNDCLOUD = "jongmyo:soundcloud-enricher";

function isSoundcloudHost(): boolean {
  const h = location.hostname.replace(/^www\./, "");
  return h === "soundcloud.com" || h.endsWith(".soundcloud.com");
}

export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_start",
  async main() {
    await injectScript("/media-session-main-world.js", { keepInDom: true });
    if (isSoundcloudHost()) {
      await injectScript("/soundcloud-enricher-main-world.js", {
        keepInDom: true,
      });
    }

    let lastCore: NowPlayingState | null = null;
    let lastEnrichment: NowPlayingEnrichment | null = null;

    function pushMerged() {
      if (!lastCore) return;
      const merged = applyNowPlayingEnrichment(
        lastCore,
        isSoundcloudHost() ? lastEnrichment : null,
      );
      void browser.runtime.sendMessage({
        type: "jongmyo:pushNowPlaying",
        payload: merged,
      });
    }

    window.addEventListener("message", (e: MessageEvent) => {
      if (e.source !== window) return;
      const m = e.data;
      if (!m || typeof m !== "object") return;

      if (
        (m as { source?: string }).source === FROM_MEDIA &&
        (m as { type?: string }).type === "nowPlaying" &&
        "payload" in m
      ) {
        try {
          lastCore = parseNowPlayingState((m as { payload: unknown }).payload);
        } catch {
          return;
        }
        pushMerged();
        return;
      }

      if (
        isSoundcloudHost() &&
        (m as { source?: string }).source === FROM_SOUNDCLOUD
      ) {
        const parsed = safeParseSoundcloudEnricherPostMessage(m);
        if (!parsed.success) return;
        lastEnrichment = enrichmentFromSoundcloudPostMessage(parsed.data);
        pushMerged();
      }
    });
  },
});
