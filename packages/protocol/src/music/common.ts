import { z } from "zod";

export const ProviderIdSchema = z.enum([
  "generic",
  "soundcloud",
  "spotify",
  "mpris",
]);

export type ProviderId = z.infer<typeof ProviderIdSchema>;

export const UrlSchema = z.string().url();
export const ImageUrlSchema = z.string().url();

export const TimestampMsSchema = z.number().nonnegative();
export const DurationMsSchema = z.number().nonnegative();
