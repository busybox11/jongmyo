import { z } from "zod";
import { ProviderIdSchema } from "./common";
import { mprisNowPlayingExtrasSchema } from "./providers/mpris";
import { soundcloudNowPlayingExtrasSchema } from "./providers/soundcloud";
import { spotifyNowPlayingExtrasSchema } from "./providers/spotify";

export const nowPlayingMetaSchema = z
  .object({
    source: z.string(),
    url: z.string(),
    image: z.string(),
  })
  .strict();

export const nowPlayingProgressSchema = z
  .object({
    playing: z.boolean(),
    current: z.number(),
    duration: z.number(),
  })
  .strict();

export const nowPlayingBaseSchema = z
  .object({
    provider: ProviderIdSchema,
    meta: nowPlayingMetaSchema,
    progress: nowPlayingProgressSchema,
    title: z.string(),
    artist: z.string(),
    album: z.string(),
  })
  .strict();

export const nowPlayingGenericSchema = nowPlayingBaseSchema.extend({
  provider: z.literal("generic"),
});

export const nowPlayingSoundcloudSchema = nowPlayingBaseSchema.extend({
  provider: z.literal("soundcloud"),
  extras: soundcloudNowPlayingExtrasSchema.optional(),
});

export const nowPlayingSpotifySchema = nowPlayingBaseSchema.extend({
  provider: z.literal("spotify"),
  extras: spotifyNowPlayingExtrasSchema.optional(),
});

export const nowPlayingMprisSchema = nowPlayingBaseSchema.extend({
  provider: z.literal("mpris"),
  extras: mprisNowPlayingExtrasSchema.optional(),
});

export const nowPlayingStateSchema = z.discriminatedUnion("provider", [
  nowPlayingGenericSchema,
  nowPlayingSoundcloudSchema,
  nowPlayingSpotifySchema,
  nowPlayingMprisSchema,
]);

export type NowPlayingState = z.infer<typeof nowPlayingStateSchema>;

export function parseNowPlayingState(raw: unknown): NowPlayingState {
  return nowPlayingStateSchema.parse(raw);
}
