import { jongmyoDebug } from "../src/debug";

export default defineUnlistedScript(() => {
  const SOURCE = "jongmyo:soundcloud-enricher";
  jongmyoDebug("soundcloudEnricher", "loaded");

  window.addEventListener("message", (e: MessageEvent) => {
    // console.log("MESSAGE", e.data);
  });
});
