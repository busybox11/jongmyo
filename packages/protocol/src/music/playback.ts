import { z } from "zod";
import { DurationMsSchema, TimestampMsSchema } from "./common";

export const PlaybackStateSchema = z
  .object({
    playing: z.boolean(),
    positionMs: TimestampMsSchema,
    durationMs: DurationMsSchema,
    rate: z.number().positive().optional(),
    shuffle: z.boolean().optional(),
    repeat: z.enum(["off", "track", "context"]).optional(),
  })
  .strict();

export type PlaybackState = z.infer<typeof PlaybackStateSchema>;

export const DeviceSchema = z
  .object({
    name: z.string(),
    type: z.string(),
    volumePercent: z.number().min(0).max(100).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export type Device = z.infer<typeof DeviceSchema>;

export const ContextSchema = z
  .object({
    type: z.string(),
    name: z.string().optional(),
    uri: z.string().optional(),
  })
  .strict();

export type Context = z.infer<typeof ContextSchema>;
