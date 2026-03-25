import { z } from "zod";

// temporary schema for now playing state
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
});

export type NowPlayingState = z.infer<typeof nowPlayingStateSchema>;

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
