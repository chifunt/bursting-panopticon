import { Utils } from './utils.js';
import { TimeManager } from './timeManager.js';
import { Markers } from './markers.js';

export const Events = (() => {
  const eventList = [
    {
      id: 'event-capital-06-00',
      day: 1,
      time: '06:00',
      markerId: 'pin-capital',
      title: 'Capital Event',
      imageSrc: 'assets/images/event-wide-sample.png',
      paragraphs: [
        'Capital event has occurred. Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        'Further details about the capital event are provided here.'
      ],
      buttons: [
        {
          text: "Let all the air bubbles burst, I don't care!",
          action: () => {
            // Hide the marker and the event popup
            hideEventPopup();
            // Resume time
            TimeManager.startTime();
          }
        }
      ],
      triggered: false
    },
    {
      id: 'event-air-12-00',
      day: 1,
      time: '12:00',
      markerId: 'pin-air',
      title: 'Air Event',
      imageSrc: 'assets/images/event-wide-sample.png',
      paragraphs: [
        'Air event has occurred. Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        'Further details about the air event are provided here.'
      ],
      buttons: [
        {
          text: "Handle the air event appropriately.",
          action: () => {
            // Hide the marker and the event popup
            hideEventPopup();
            // Resume time
            TimeManager.startTime();
          }
        }
      ],
      triggered: false
    }
    // Add more events as needed
  ];

  // Reference to DOM elements
  const eventPopup = document.querySelector('.event-popup');
  const eventImage = eventPopup.querySelector('img');
  const eventTitle = eventPopup.querySelector('h2');
  const eventTextContainer = eventPopup.querySelector('.event-text-container');
  const eventButtonsContainer = eventPopup.querySelector('.event-buttons-container');

  // Initialize the event popup as hidden
  const init = () => {
    hideEventPopup();
  };

  // Show event popup with specific event data
  const showEvent = (event) => {
    if (event.triggered) return;

    // Populate the popup with event data
    eventImage.src = event.imageSrc;
    eventTitle.innerText = event.title;
    eventTextContainer.innerHTML = '';
    event.paragraphs.forEach(paragraph => {
      const p = document.createElement('p');
      p.innerText = paragraph;
      eventTextContainer.appendChild(p);
    });

    eventButtonsContainer.innerHTML = '';
    event.buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.innerText = button.text;
      btn.addEventListener('click', button.action);
      eventButtonsContainer.appendChild(btn);
    });

    // Instead of eventPopup.style.display = 'flex';
    // just add the 'visible' class:
    eventPopup.classList.add('visible');

    Utils.log(`Event "${event.id}" displayed.`);

    // Mark the event as triggered
    event.triggered = true;
  };

  // Hide the event popup
  const hideEventPopup = () => {
    // Instead of eventPopup.style.display = 'none';
    // remove the 'visible' class:
    eventPopup.classList.remove('visible');

    Utils.log('Event popup hidden.');
  };

  // Find and return event based on day and time
  const getEventByTime = (day, time) => {
    return eventList.find(event => event.day === day && event.time === time && !event.triggered);
  };

  // Find and return event based on markerId
  const getEventByMarker = (markerId) => {
    return eventList.find(event => event.markerId === markerId && !event.triggered);
  };

  // Handle marker click to show associated event
  const handleMarkerEvent = (markerId) => {
    const event = getEventByMarker(markerId);
    if (event) {
      showEvent(event);
    }
  };

  return {
    init,
    showEvent,
    hideEventPopup,
    getEventByTime,
    handleMarkerEvent
  };
})();
