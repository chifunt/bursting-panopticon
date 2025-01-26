export const Flags = (() => {
  // We store boolean flags (or any values) in this simple object
  let flags = {};

  const init = () => {
    // Reset or initialize your flags here
    flags = {};
  };

  const setFlag = (name, value) => {
    flags[name] = value;
  };

  const getFlag = (name) => {
    // Return the stored flag (or undefined/false if not set)
    return flags.hasOwnProperty(name) ? flags[name] : false;
  };

  return {
    init,
    setFlag,
    getFlag
  };
})();
