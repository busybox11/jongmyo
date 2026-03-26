import { z } from "zod";

/**
 * SoundCloud-specific data on top of generic {@link import("../index").NowPlayingState}
 */
export type SoundcloudEnrichment = {
  waveform?: number[];
  genres?: string[];
};

export const soundcloudEnrichmentSchema = z
  .object({
    waveform: z.array(z.number()).optional(),
    genres: z.array(z.string()).optional(),
  })
  .strict();

export type SoundcloudEnrichmentParsed = z.infer<
  typeof soundcloudEnrichmentSchema
>;

export const soundcloudEnrichmentPatchSchema =
  soundcloudEnrichmentSchema.partial();

export type SoundcloudEnrichmentPatch = z.infer<
  typeof soundcloudEnrichmentPatchSchema
>;

export const soundcloudEnricherPostMessageSchema = z.object({
  source: z.literal("jongmyo:soundcloud-enricher"),
  type: z.literal("extras"),
  sessionKey: z.string(),
  payload: soundcloudEnrichmentPatchSchema,
});

export type SoundcloudEnricherPostMessage = z.infer<
  typeof soundcloudEnricherPostMessageSchema
>;

export function safeParseSoundcloudEnricherPostMessage(
  raw: unknown,
): z.SafeParseReturnType<unknown, SoundcloudEnricherPostMessage> {
  return soundcloudEnricherPostMessageSchema.safeParse(raw);
}

export function soundcloudSessionKeyFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (!host.endsWith("soundcloud.com")) return null;
    const key = u.pathname.replace(/^\/+|\/+$/g, "");
    return key.length > 0 ? key : null;
  } catch {
    return null;
  }
}
