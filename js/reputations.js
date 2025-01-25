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

  // Generalized Change Method
  const changeReputation = (name, amount) => {
    if (typeof name !== 'string') {
      console.warn(`Reputation name must be a string. Received: ${typeof name}`);
      return;
    }
    if (typeof amount !== 'number') {
      console.warn(`Amount must be a number. Received: ${typeof amount}`);
      return;
    }

    if (reputations.hasOwnProperty(name)) {
      reputations[name] += amount;
      // Prevent negative values
      if (reputations[name] < 0) reputations[name] = 0;
      // Optional: Clamp to a maximum value
      const MAX_REPUTATION_VALUE = 1000;
      if (reputations[name] > MAX_REPUTATION_VALUE) reputations[name] = MAX_REPUTATION_VALUE;
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
    changeReputation, // Exposed generalized change method
    init, // Expose the init method
  };
})();
