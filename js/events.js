// js/events.js
import { Utils } from './utils.js';
import { TimeManager } from './timeManager.js';
import { Resources } from './resources.js';
import { Reputations } from './reputations.js';
import { Flags } from './flags.js';
import { LOCATION_MARKER_MAP } from './eventsLocationMap.js';
import { AudioManager } from './audioManager.js'; // Import AudioManager

export const Events = (() => {
  let eventList = [];
  const DEFAULT_IMAGE_SRC = 'assets/images/event-wide-sample.png';

  // DOM references
  const eventPopup = document.querySelector('.event-popup');
  const eventImage = eventPopup.querySelector('img');
  const eventTitle = eventPopup.querySelector('h2');
  const eventTextContainer = eventPopup.querySelector('.event-text-container');
  const eventButtonsContainer = eventPopup.querySelector('.event-buttons-container');

  // Initialize events by loading JSON files
  const init = async () => {
    hideEventPopup();
    const dayFiles = [
      'assets/data/day1.json',
      'assets/data/day2.json',
      'assets/data/day3.json',
      'assets/data/day4.json',
      'assets/data/day5.json'
    ];

    try {
      for (const filePath of dayFiles) {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
        }
        const dayData = await response.json();

        // Merge each day's events into the master list
        const transformedEvents = dayData.events.map((evt, index) =>
          transformJsonEvent(evt, index, dayData.day)
        );
        eventList = eventList.concat(transformedEvents);

        Utils.log(`Loaded events from ${filePath}`);
      }

      Utils.log('All day JSON files loaded and transformed.');
    } catch (error) {
      Utils.log(`Error initializing events: ${error.message}`);
    }
  };

  // Transform raw JSON event to internal shape
  const transformJsonEvent = (jsonEvent, index, dayNumber) => {
    const id = `event-day${dayNumber}-${jsonEvent.time || 'XX:XX'}-${index}`;
    const markerId = LOCATION_MARKER_MAP[jsonEvent.location] || 'pin-capital';

    return {
      id,
      day: dayNumber,
      time: jsonEvent.time,
      markerId,
      title: jsonEvent.title,
      imageSrc: jsonEvent.image,
      soundSrc: jsonEvent.sound || null,
      paragraphs: jsonEvent.text,
      buttons: (jsonEvent.buttons || []).map(btn => transformJsonButton(btn)),
      dependencies: jsonEvent.dependencies || [],
      triggered: false
    };
  };

  // Transform JSON button to internal structure
  const transformJsonButton = (jsonButton) => {
    let deductionsText = '';

    // Extract resource deductions (amount < 0)
    if (jsonButton.outcomes && jsonButton.outcomes.resources && jsonButton.outcomes.reputation) {
      const deductions = [];
      const sortedResources = Object.entries(jsonButton.outcomes.resources).sort(([, amountA], [, amountB]) => amountA - amountB);
      const sortedRep = Object.entries(jsonButton.outcomes.reputation).sort(([, amountA], [, amountB]) => amountA - amountB);
      for (const [resName, amount] of sortedResources) {
        if (amount != 0) {
          const resourceDisplayName = resName.charAt(0).toUpperCase() + resName.slice(1);
          deductions.push(`${resourceDisplayName}: ${amount > 0 ? "+" : " "}${amount}`);
        }
      }
      for (const [repName, amount] of sortedRep) {
        if (amount != 0) {
          const repDisplayName = repName.charAt(0).toUpperCase() + repName.slice(1);
          deductions.push(`${repDisplayName} Reputation: ${amount > 0 ? "+" : " "}${amount}`);
        }
      }
      deductionsText = deductions.join(', '); // e.g., "Water: -5, Oil: -5"
    }

    return {
      text: jsonButton.text,
      requires: jsonButton.requires || {},
      deductions: deductionsText, // Add deductionsText to the button object
      action: () => {
        if (jsonButton.outcomes) {
          const { resources, reputation, flags } = jsonButton.outcomes;

          // Update resources
          if (resources) {
            Object.entries(resources).forEach(([resName, amount]) => {
              Resources.changeResource(resName, amount);
            });
          }

          // Update reputation
          if (reputation) {
            Object.entries(reputation).forEach(([repName, amount]) => {
              Reputations.changeReputation(repName, amount);
            });
          }

          // Update flags
          if (flags) {
            Object.entries(flags).forEach(([flagName, flagValue]) => {
              Flags.setFlag(flagName, flagValue);
            });
          }
        }

        // Close popup and resume time
        hideEventPopup();
        TimeManager.startTime();
      }
    };
  };

  // Check dependencies (flags, resources, reputation)
  const checkDependencies = (event) => {
    if (!event.dependencies || event.dependencies.length === 0) {
      return true;
    }
    for (const dep of event.dependencies) {
      const { type, name, value } = dep;
      if (type === 'flag') {
        if (Flags.getFlag(name) !== value) {
          return false;
        }
      } else if (type === 'resource') {
        if (Resources.getResource(name) < value) {
          return false;
        }
      } else if (type === 'reputation') {
        if (Reputations.getReputation(name) < value) {
          return false;
        }
      }
    }
    return true;
  };

  // Find events for a given day & time
  const getEventByTime = (day, time) => {
    return eventList.find(
      e => e.day === day && e.time === time && !e.triggered && checkDependencies(e)
    );
  };

  // Find events for a marker
  const getEventByMarker = (markerId) => {
    return eventList.find(
      e => e.markerId === markerId && !e.triggered && checkDependencies(e)
    );
  };

  // Show event popup
  const showEvent = (event) => {
    if (event.triggered) return;

    // Set fallback image if the original fails
    eventImage.onerror = function () {
      if (this.src !== window.location.origin + '/' + DEFAULT_IMAGE_SRC) {
        this.src = DEFAULT_IMAGE_SRC;
      }
    };
    eventImage.src = event.imageSrc;

    eventTitle.innerText = event.title;

    // Clear and populate text container
    eventTextContainer.innerHTML = '';
    event.paragraphs.forEach(par => {
      const p = document.createElement('p');
      p.innerText = par;
      eventTextContainer.appendChild(p);
    });

    // **Force scroll to top**
    eventTextContainer.scrollTop = 0;

    // Clear and populate buttons container
    eventButtonsContainer.innerHTML = '';
    event.buttons.forEach(btn => {
      const buttonElem = document.createElement('button');
      buttonElem.innerText = btn.text;

      // Set data-deductions attribute if deductions exist
      if (btn.deductions) {
        buttonElem.setAttribute('data-deductions', btn.deductions);
      }

      // Check if requirements are met
      const isEnabled = checkButtonRequirements(btn.requires);
      buttonElem.disabled = !isEnabled;

      // If the button is disabled, set a data-tooltip explaining why
      if (!isEnabled) {
        const tooltipText = generateRequirementsTooltip(btn.requires);
        buttonElem.setAttribute('data-tooltip', tooltipText);
        // Optionally, add a CSS class for styling disabled buttons
        buttonElem.classList.add('disabled-button');
      }

      // Add hover sound
      buttonElem.addEventListener('mouseenter', () => {
        AudioManager.playSound('hover');
      });

      // Add click sound
      buttonElem.addEventListener('click', () => {
        AudioManager.playSound('click');
      });

      // Add the action
      buttonElem.addEventListener('click', btn.action);
      eventButtonsContainer.appendChild(buttonElem);
    });

    // Play event-specific sound if provided
    if (event.soundSrc) {
      const eventSound = new Audio(event.soundSrc);
      eventSound.play().catch(error => {
        console.error(`Error playing event sound "${event.soundSrc}":`, error);
      });
    }

    eventPopup.classList.add('visible');
    Utils.log(`Event "${event.id}" displayed.`);
    event.triggered = true;
  };

  // Hide event popup
  const hideEventPopup = () => {
    eventPopup.classList.remove('visible');
    Utils.log('Event popup hidden.');
  };

  // Marker click -> show event
  const handleMarkerEvent = (markerId) => {
    const event = getEventByMarker(markerId);
    if (event) {
      showEvent(event);
    }
  };

  /**
   * Helper function to check if button requirements are met
   */
  const checkButtonRequirements = (requires) => {
    if (!requires || Object.keys(requires).length === 0) {
      return true;
    }

    // Check resource requirements
    if (requires.resources) {
      for (const [resName, amount] of Object.entries(requires.resources)) {
        if (Resources.getResource(resName) < amount) {
          return false;
        }
      }
    }

    // Check reputation requirements
    if (requires.reputation) {
      for (const [repName, amount] of Object.entries(requires.reputation)) {
        if (Reputations.getReputation(repName) < amount) {
          return false;
        }
      }
    }

    // Check flag requirements
    if (requires.flags) {
      for (const [flagName, flagValue] of Object.entries(requires.flags)) {
        if (Flags.getFlag(flagName) !== flagValue) {
          return false;
        }
      }
    }

    // All requirements met
    return true;
  };

  /**
   * Helper function to generate a tooltip text based on unmet requirements
   */
  const generateRequirementsTooltip = (requires) => {
    if (!requires || Object.keys(requires).length === 0) {
      return '';
    }

    const unmet = [];

    // Check resource requirements
    if (requires.resources) {
      for (const [resName, amount] of Object.entries(requires.resources)) {
        if (Resources.getResource(resName) < amount) {
          const resourceDisplayName = resName.charAt(0).toUpperCase() + resName.slice(1);
          unmet.push(`${resourceDisplayName}: ${amount} required`);
        }
      }
    }

    // Check reputation requirements
    if (requires.reputation) {
      for (const [repName, amount] of Object.entries(requires.reputation)) {
        if (Reputations.getReputation(repName) < amount) {
          const reputationDisplayName = repName.charAt(0).toUpperCase() + repName.slice(1);
          unmet.push(`${reputationDisplayName}: ${amount} required`);
        }
      }
    }

    // Check flag requirements
    if (requires.flags) {
      for (const [flagName, flagValue] of Object.entries(requires.flags)) {
        if (Flags.getFlag(flagName) !== flagValue) {
          const flagDisplayName = flagName.replace(/FL_/g, '').replace(/_/g, ' ').toLowerCase();
          unmet.push(`Flag "${flagDisplayName}" must be ${flagValue}`);
        }
      }
    }

    // Combine all unmet requirements into a single string
    return unmet.join(', ');
  };

  // Expose methods
  return {
    init,
    showEvent,
    hideEventPopup,
    getEventByTime,
    handleMarkerEvent
  };
})();
