import { z } from "zod";

export const mprisNowPlayingExtrasSchema = z
  .object({
    playerIdentity: z.string().optional(),
    desktopEntry: z.string().optional(),
    busName: z.string().optional(),
    playerName: z.string().optional(),
  })
  .strict();

export type MprisNowPlayingExtras = z.infer<typeof mprisNowPlayingExtrasSchema>;
