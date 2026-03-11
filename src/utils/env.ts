export const isDev = import.meta.env.DEV;

/**
 * Determine if app is running on the car thing based on:
 * - The user agent (Chrome 69)
 * - The viewport width (800px)
 * - The viewport height (480px)
 */
export const isCarThing =
  navigator.userAgent.includes("Chrome/69") &&
  window.innerWidth === 800 &&
  window.innerHeight === 480;
