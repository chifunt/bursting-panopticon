export const Utils = (() => {
  let debugMode = false;

  const setDebugMode = (mode) => {
    debugMode = mode;
  };

  const log = (...args) => {
    if (debugMode) {
      console.log(...args);
    }
  };

  return {
    setDebugMode,
    log,
  };
})();
