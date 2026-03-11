// Prevents React dev Performance.measure() from throwing (Chrome 69 / buggy mark names)
if (typeof performance !== "undefined" && performance.measure) {
  const orig = performance.measure.bind(performance);
  performance.measure = (...args: Parameters<Performance["measure"]>) => {
    try {
      return orig(...args);
    } catch {
      return undefined;
    }
  };
}
