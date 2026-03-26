import { z } from "zod";
import {
  applyNowPlayingEnrichment,
  enrichmentFromSoundcloudPostMessage,
  nowPlayingEnrichmentSchema,
  type NowPlayingEnrichment,
} from "./music/enrichment";
import {
  nowPlayingStateSchema,
  parseNowPlayingState,
  type NowPlayingState,
} from "./music/nowPlaying";

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
export type { ProviderId } from "./providers/types";

export {
  applyNowPlayingEnrichment,
  enrichmentFromSoundcloudPostMessage,
  parseNowPlayingState,
  nowPlayingEnrichmentSchema,
  nowPlayingStateSchema,
};
export type { NowPlayingEnrichment, NowPlayingState };

export {
  ContextSchema,
  DeviceSchema,
  PlaybackStateSchema,
} from "./music/playback";
export type { Context, Device, PlaybackState } from "./music/playback";

export { AlbumSchema, ArtistSchema, TrackSchema } from "./music/entities";
export type { Album, Artist, Track } from "./music/entities";

export { ProviderIdSchema } from "./music/common";

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

export const getNowPlayingResponseSchema = z.object({
  state: nowPlayingStateSchema.nullable(),
});

export type GetNowPlayingResponse = z.infer<typeof getNowPlayingResponseSchema>;
