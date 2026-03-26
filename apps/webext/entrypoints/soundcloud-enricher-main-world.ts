import { jongmyoDebug } from "../src/debug";

// e,t,n
// e: exports
// t: type
// n: name
type WebpackModule = {
  e: unknown;
  t: unknown;
  n: string;
};

type WebpackChunk =
  | { [key: number]: WebpackModule } // object form with number keys
  | ArrayLike<WebpackModule>; // array form with number indices

declare global {
  interface Window {
    webpackJsonp: [number, WebpackChunk | WebpackModule[]][];
  }
}

export default defineUnlistedScript(() => {
  const SOURCE = "jongmyo:soundcloud-enricher";
  jongmyoDebug("soundcloudEnricher", "loaded");

  window.webpackJsonp.forEach((chunk) => {
    const modules = chunk[1];

    const mdArr = Array.isArray(modules) ? modules : Object.values(modules);
    for (const _module of mdArr) {
      // TODO: analyse module fn exports, check for named exported function called "loadWaveformData"
    }
  });
});
