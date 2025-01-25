export const Resources = (() => {
  const resources = {
    water: 134,
    gas: 243,
    fat: 233,
    air: 454,
    oil: 532,
  };

  const getResource = (name) => resources[name];

  const setResource = (name, value) => {
    if (resources.hasOwnProperty(name)) {
      resources[name] = value;
      updateDOM(name, value);
    } else {
      console.warn(`Resource "${name}" does not exist.`);
    }
  };

  const incrementResource = (name, amount) => {
    if (resources.hasOwnProperty(name)) {
      resources[name] += amount;
      updateDOM(name, resources[name]);
    } else {
      console.warn(`Resource "${name}" does not exist.`);
    }
  };

  const updateDOM = (name, value) => {
    const resourceElement = document.getElementById(`resource-${name}`);
    if (resourceElement) {
      resourceElement.innerText = value;
    } else {
      console.warn(`DOM element for resource "${name}" not found.`);
    }
  };

  // Initialization function to set initial values in the DOM
  const init = () => {
    Object.entries(resources).forEach(([name, value]) => {
      updateDOM(name, value);
    });
  };

  return {
    resources,
    getResource,
    setResource,
    incrementResource,
    init, // Expose the init method
  };
})();
