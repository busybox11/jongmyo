import { z } from "zod";
import {
  type SoundcloudEnrichment,
  type SoundcloudEnrichmentPatch,
  soundcloudEnrichmentSchema,
  soundcloudSessionKeyFromUrl,
} from "./providers/soundcloud";

export {
  safeParseSoundcloudEnricherPostMessage,
  soundcloudEnricherPostMessageSchema,
  soundcloudEnrichmentPatchSchema,
  soundcloudEnrichmentSchema,
  soundcloudSessionKeyFromUrl,
} from "./providers/soundcloud";
export type {
  SoundcloudEnricherPostMessage,
  SoundcloudEnrichment,
  SoundcloudEnrichmentParsed,
  SoundcloudEnrichmentPatch,
} from "./providers/soundcloud";
export type { GenericProviderEnrichment, ProviderId } from "./providers/types";

export const nowPlayingExtrasSchema = z
  .object({
    soundcloud: soundcloudEnrichmentSchema.optional(),
  })
  .strict();

export type NowPlayingExtras = z.infer<typeof nowPlayingExtrasSchema>;

export const nowPlayingStateSchema = z.object({
  meta: z.object({
    source: z.string(),
    url: z.string(),
    image: z.string(),
  }),
  progress: z.object({
    playing: z.boolean(),
    current: z.number(),
    duration: z.number(),
  }),
  title: z.string(),
  artist: z.string(),
  album: z.string(),
  extras: nowPlayingExtrasSchema.optional(),
});

export type NowPlayingState = z.infer<typeof nowPlayingStateSchema>;

function stripSoundcloudExtras(core: NowPlayingState): NowPlayingState {
  if (!core.extras?.soundcloud) return core;
  const { soundcloud: _sc, ...restExtras } = core.extras;
  return {
    ...core,
    extras: Object.keys(restExtras).length > 0 ? restExtras : undefined,
  };
}

/**
 * Merge SoundCloud enrichment only when `sessionKey` matches the playing track URL
 * This will very likely be replaced by a more generic enrichment system in the future
 * I'm just trying things out (sorry)
 */
export function mergeNowPlayingWithSoundcloudEnrichment(
  core: NowPlayingState,
  enrichment: {
    sessionKey: string;
    extras: SoundcloudEnrichmentPatch;
  } | null,
): NowPlayingState {
  if (!enrichment) {
    return stripSoundcloudExtras(core);
  }
  const key = soundcloudSessionKeyFromUrl(core.meta.url);
  if (!key || key !== enrichment.sessionKey) {
    return stripSoundcloudExtras(core);
  }
  const prev = core.extras?.soundcloud ?? {};
  const soundcloud: SoundcloudEnrichment = { ...prev, ...enrichment.extras };
  return {
    ...core,
    extras: { ...core.extras, soundcloud },
  };
}

export const serverMessageSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("now_playing"),
    state: nowPlayingStateSchema,
  }),
]);

export type ServerMessage = z.infer<typeof serverMessageSchema>;

export function parseServerMessage(raw: unknown): ServerMessage {
  return serverMessageSchema.parse(raw);
}

export function safeParseServerMessage(
  raw: unknown,
): z.SafeParseReturnType<unknown, ServerMessage> {
  return serverMessageSchema.safeParse(raw);
}

export function parseNowPlayingState(raw: unknown): NowPlayingState {
  return nowPlayingStateSchema.parse(raw);
}

export const getNowPlayingResponseSchema = z.object({
  state: nowPlayingStateSchema.nullable(),
});

export type GetNowPlayingResponse = z.infer<typeof getNowPlayingResponseSchema>;
