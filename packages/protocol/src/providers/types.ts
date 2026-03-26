/**
 * Identifies which platform-specific enrichment shape (if any) applies.
 * `generic` means no `extras.*` payload — core {@link import("../index").NowPlayingState} is enough.
 */
export type ProviderId = "generic" | "soundcloud";

/** No extra fields beyond core state for unknown / typical web players. */
export type GenericProviderEnrichment = Record<string, never>;
