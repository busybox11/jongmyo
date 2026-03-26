import { z } from "zod";
import type { SoundcloudEnricherPostMessage } from "./providers/soundcloud";
import {
  soundcloudNowPlayingExtrasPatchSchema,
  soundcloudSessionKeyFromUrl,
} from "./providers/soundcloud";
import type { NowPlayingState } from "./nowPlaying";

/**
 * Side-channel patches from provider-specific main-world scripts (waveforms, credits, …).
 * Extend with `z.discriminatedUnion` branches as new providers ship enrichers.
 */
export const nowPlayingEnrichmentSchema = z.discriminatedUnion("provider", [
  z
    .object({
      provider: z.literal("soundcloud"),
      sessionKey: z.string(),
      extras: soundcloudNowPlayingExtrasPatchSchema,
    })
    .strict(),
]);

export type NowPlayingEnrichment = z.infer<typeof nowPlayingEnrichmentSchema>;

export function enrichmentFromSoundcloudPostMessage(
  msg: SoundcloudEnricherPostMessage,
): Extract<NowPlayingEnrichment, { provider: "soundcloud" }> {
  return {
    provider: "soundcloud",
    sessionKey: msg.sessionKey,
    extras: msg.payload,
  };
}

function applySoundcloud(
  core: NowPlayingState,
  enrichment: Extract<NowPlayingEnrichment, { provider: "soundcloud" }>,
): NowPlayingState {
  if (core.provider !== "soundcloud" && core.provider !== "generic") {
    return core;
  }
  const key = soundcloudSessionKeyFromUrl(core.meta.url);
  if (!key || key !== enrichment.sessionKey) {
    if (core.provider === "soundcloud") return { ...core, extras: undefined };
    return core;
  }
  if (core.provider === "generic") {
    return {
      ...core,
      provider: "soundcloud",
      extras: { ...enrichment.extras },
    };
  }
  return {
    ...core,
    extras: { ...(core.extras ?? {}), ...enrichment.extras },
  };
}

/** Clear host-provided extras when no enrichment is cached (session mismatch uses this via `apply*` key checks). */
function stripEnrichableExtras(core: NowPlayingState): NowPlayingState {
  if (core.provider === "soundcloud") return { ...core, extras: undefined };
  return core;
}

/**
 * Merge a single enrichment snapshot into `core`. Pass `null` to drop cached enrichment
 * (e.g. left SoundCloud tab).
 */
export function applyNowPlayingEnrichment(
  core: NowPlayingState,
  enrichment: NowPlayingEnrichment | null,
): NowPlayingState {
  if (enrichment == null) return stripEnrichableExtras(core);
  switch (enrichment.provider) {
    case "soundcloud":
      return applySoundcloud(core, enrichment);
  }
}
