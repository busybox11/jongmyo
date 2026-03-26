import { parseNowPlayingState } from "@jongmyo/protocol";
import { jongmyoDebug } from "./debug";

const DAEMON_POST_URL =
  import.meta.env?.WXT_DAEMON_POST_URL ??
  "http://172.16.42.1:8787/v1/now-playing";

export async function pushNowPlayingToDaemon(body: unknown): Promise<void> {
  const state = parseNowPlayingState(body);
  jongmyoDebug("daemon", "POST", DAEMON_POST_URL, {
    title: state.title,
    artist: state.artist,
    playing: state.progress.playing,
  });
  const res = await fetch(DAEMON_POST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  jongmyoDebug("daemon", "POST response", res.status, res.statusText);
  if (!res.ok) {
    throw new Error(`daemon POST failed: ${res.status}`);
  }
}
