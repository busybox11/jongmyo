export function jongmyoDebug(...args: unknown[]): void {
  const v = process.env.JONGMYO_DEBUG;
  if (v === undefined || v === "" || v === "0" || v === "false") return;
  console.debug("[jongmyo:daemon]", ...args);
}
