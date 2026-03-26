import { z } from "zod";
import { ImageUrlSchema, UrlSchema } from "./common";

export const ArtistSchema = z
  .object({
    name: z.string(),
  })
  .strict();

export type Artist = z.infer<typeof ArtistSchema>;

export const AlbumSchema = z
  .object({
    title: z.string(),
  })
  .strict();

export type Album = z.infer<typeof AlbumSchema>;

export const TrackSchema = z
  .object({
    title: z.string(),
    artists: z.array(ArtistSchema),
    album: AlbumSchema.optional(),
    images: z.array(ImageUrlSchema).optional(),
    externalUrls: z.record(z.string(), UrlSchema).optional(),
    identifiers: z.record(z.string(), z.string()).optional(),
  })
  .strict();

export type Track = z.infer<typeof TrackSchema>;
