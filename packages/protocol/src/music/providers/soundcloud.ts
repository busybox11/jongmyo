import { z } from "zod";

export const soundcloudNowPlayingExtrasSchema = z
  .object({
    waveform: z.array(z.number()).optional(),
    genres: z.array(z.string()).optional(),
  })
  .strict();

export type SoundcloudNowPlayingExtras = z.infer<
  typeof soundcloudNowPlayingExtrasSchema
>;

export const soundcloudNowPlayingExtrasPatchSchema =
  soundcloudNowPlayingExtrasSchema.partial();

export type SoundcloudNowPlayingExtrasPatch = z.infer<
  typeof soundcloudNowPlayingExtrasPatchSchema
>;

export const soundcloudEnricherPostMessageSchema = z.object({
  source: z.literal("jongmyo:soundcloud-enricher"),
  type: z.literal("extras"),
  sessionKey: z.string(),
  payload: soundcloudNowPlayingExtrasPatchSchema,
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
  const raw = url.trim();
  if (!raw) return null;
  const hostMatch = raw.match(/^https?:\/\/([^/?#]+)/i);
  if (!hostMatch) return null;
  const host = hostMatch[1].replace(/^www\./i, "").toLowerCase();
  if (!host.endsWith("soundcloud.com")) return null;
  const pathStart = raw.indexOf(hostMatch[0]) + hostMatch[0].length;
  const rest = raw.slice(pathStart);
  const pathOnly = rest.split(/[?#]/, 1)[0] ?? "";
  const key = pathOnly.replace(/^\/+|\/+$/g, "");
  return key.length > 0 ? key : null;
}
