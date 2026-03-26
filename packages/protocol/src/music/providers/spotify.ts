import { z } from "zod";
import { ContextSchema, DeviceSchema } from "../playback";

export const spotifyNowPlayingExtrasSchema = z
  .object({
    device: DeviceSchema.optional(),
    context: ContextSchema.optional(),
  })
  .strict();

export type SpotifyNowPlayingExtras = z.infer<typeof spotifyNowPlayingExtrasSchema>;
