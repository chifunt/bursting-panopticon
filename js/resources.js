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

  // Generalized Change Method
  const changeResource = (name, amount) => {
    if (typeof name !== 'string') {
      console.warn(`Resource name must be a string. Received: ${typeof name}`);
      return;
    }
    if (typeof amount !== 'number') {
      console.warn(`Amount must be a number. Received: ${typeof amount}`);
      return;
    }

    if (resources.hasOwnProperty(name)) {
      resources[name] += amount;
      // Prevent negative values
      if (resources[name] < 0) resources[name] = 0;
      // Optional: Clamp to a maximum value
      const MAX_RESOURCE_VALUE = 1000;
      if (resources[name] > MAX_RESOURCE_VALUE) resources[name] = MAX_RESOURCE_VALUE;
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
    changeResource, // Exposed generalized change method
    init, // Expose the init method
  };
})();
