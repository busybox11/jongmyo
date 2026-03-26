export function jongmyoDebug(scope: string, ...args: unknown[]): void {
  const env = import.meta.env;
  const forced = env.JONGMYO_DEBUG === "1" || env.JONGMYO_DEBUG === "true";
  const dev = env.DEV === true;
  if (!forced && !dev) return;
  console.debug(`[jongmyo:${scope}]`, ...args);
}
