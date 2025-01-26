// Events.js
import { Utils } from './utils.js';
import { TimeManager } from './timeManager.js';
import { Resources } from './resources.js';
import { Reputations } from './reputations.js';
import { Flags } from './flags.js';
import { LOCATION_MARKER_MAP } from './eventsLocationMap.js';

export const Events = (() => {
  let eventList = [];

  const DEFAULT_IMAGE_SRC = 'assets/images/event-wide-sample.png';

  // DOM references
  const eventPopup = document.querySelector('.event-popup');
  const eventImage = eventPopup.querySelector('img');
  const eventTitle = eventPopup.querySelector('h2');
  const eventTextContainer = eventPopup.querySelector('.event-text-container');
  const eventButtonsContainer = eventPopup.querySelector('.event-buttons-container');

  // 1. Load all JSON files for days 1 through 5
  const init = async () => {
    hideEventPopup();

    // If you add more days, just add them here:
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

  // 2. Transform raw JSON event to internal shape
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

  // 3. Transform JSON button to internal structure
  const transformJsonButton = (jsonButton) => {
    let deductionsText = '';

    // Extract resource deductions (amount < 0)
    if (jsonButton.outcomes && jsonButton.outcomes.resources) {
      const deductions = [];
      for (const [resName, amount] of Object.entries(jsonButton.outcomes.resources)) {
        if (amount < 0) {
          // Capitalize the resource name for better readability
          const resourceDisplayName = resName.charAt(0).toUpperCase() + resName.slice(1);
          deductions.push(`${resourceDisplayName}: ${amount}`);
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

  // 4. Check dependencies (flags, resources, reputation)
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

  // 5. Find events for a given day & time
  const getEventByTime = (day, time) => {
    return eventList.find(
      e => e.day === day && e.time === time && !e.triggered && checkDependencies(e)
    );
  };

  // 6. Find events for a marker
  const getEventByMarker = (markerId) => {
    return eventList.find(
      e => e.markerId === markerId && !e.triggered && checkDependencies(e)
    );
  };

  // 7. Show event popup
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

      buttonElem.addEventListener('click', btn.action);
      eventButtonsContainer.appendChild(buttonElem);
    });

    // Play sound if provided
    if (event.soundSrc) {
      const audio = new Audio(event.soundSrc);
      audio.play();
    }

    eventPopup.classList.add('visible');
    Utils.log(`Event "${event.id}" displayed.`);
    event.triggered = true;
  };

  // 8. Hide event popup
  const hideEventPopup = () => {
    eventPopup.classList.remove('visible');
    Utils.log('Event popup hidden.');
  };

  // 9. Marker click -> show event
  const handleMarkerEvent = (markerId) => {
    const event = getEventByMarker(markerId);
    if (event) {
      showEvent(event);
    }
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
