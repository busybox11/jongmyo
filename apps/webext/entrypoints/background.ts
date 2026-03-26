import { pushNowPlayingToDaemon } from "../src/daemon";
import { jongmyoDebug } from "../src/debug";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (
      message &&
      typeof message === "object" &&
      "type" in message &&
      message.type === "jongmyo:pushNowPlaying" &&
      "payload" in message
    ) {
      jongmyoDebug("background", "pushNowPlaying");
      void pushNowPlayingToDaemon(message.payload).then(
        () => {
          jongmyoDebug("background", "pushNowPlaying ok");
          sendResponse({ ok: true });
        },
        (err: unknown) => {
          jongmyoDebug("background", "pushNowPlaying error", err);
          sendResponse({
            ok: false,
            error: err instanceof Error ? err.message : String(err),
          });
        },
      );
      return true;
    }
    return undefined;
  });
});
