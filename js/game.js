import { Resources } from './resources.js';
import { Reputations } from './reputations.js';
import { TimeManager } from './timeManager.js';
import { Utils } from './utils.js';
import { Markers } from './markers.js';
import { Events } from './events.js';
import { Flags } from './flags.js';

export const Game = (() => {
  const debugMode = true;
  Utils.setDebugMode(debugMode);

  // Initialize game state
  const init = () => {
    Utils.log('Game initialized.');

    // Initialize Resources and Reputations in the DOM
    Resources.init();
    Reputations.init();

    Flags.init();

    // Initialize Markers
    Markers.init();

    // Initialize Events
    Events.init();

    // Start the game time
    TimeManager.startTime();
  };

  // Callback for when the next day begins
  const onNextDay = (day) => {
    Utils.log(`Day ${day} has begun.`);
    // Additional logic for a new day can be added here
  };

  // Handle specific time events
  const handleTimeEvent = (day, time) => {
    // Check if there's an event at the current day and time
    const event = Events.getEventByTime(day, time);
    if (event) {
      Markers.showMarker(event.markerId);
      Utils.log(`Marker "${event.markerId}" displayed at ${time} on Day ${day}.`);

      // STOP the time here so the player can't ignore the marker
      TimeManager.stopTime();
    }
  };

  // Handle marker click events to show associated events
  const handleMarkerClick = (markerId) => {
    Markers.hideMarker(markerId);
    Events.handleMarkerEvent(markerId);
  };

  // Expose methods
  return {
    init,
    onNextDay,
    handleTimeEvent,
    Resources,
    Reputations,
    TimeManager,
    Markers,
    Events,
    handleMarkerClick
  };
})();
