export const Reputations = (() => {
  const reputations = {
    air: 102,
    oil: 103,
    gas: 104,
    cavitation: 105,
  };

  const getReputation = (name) => reputations[name];

  const setReputation = (name, value) => {
    if (reputations.hasOwnProperty(name)) {
      reputations[name] = value;
      updateDOM(name, value);
    } else {
      console.warn(`Reputation "${name}" does not exist.`);
    }
  };

  const incrementReputation = (name, amount) => {
    if (reputations.hasOwnProperty(name)) {
      reputations[name] += amount;
      updateDOM(name, reputations[name]);
    } else {
      console.warn(`Reputation "${name}" does not exist.`);
    }
  };

  const updateDOM = (name, value) => {
    const reputationElement = document.getElementById(`reputation-${name}`);
    if (reputationElement) {
      reputationElement.innerText = value;
    } else {
      console.warn(`DOM element for reputation "${name}" not found.`);
    }
  };

  // Initialization function to set initial values in the DOM
  const init = () => {
    Object.entries(reputations).forEach(([name, value]) => {
      updateDOM(name, value);
    });
  };

  return {
    reputations,
    getReputation,
    setReputation,
    incrementReputation,
    init, // Expose the init method
  };
})();
