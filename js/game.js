import { Resources } from './resources.js';
import { Reputations } from './reputations.js';
import { TimeManager } from './timeManager.js';
import { Utils } from './utils.js';
import { Markers } from './markers.js';

export const Game = (() => {
  const debugMode = true;
  Utils.setDebugMode(debugMode);

  // Initialize game state
  const init = () => {
    Utils.log('Game initialized.');

    // Initialize Resources and Reputations in the DOM
    Resources.init();
    Reputations.init();

    // Initialize Markers
    Markers.init();

    // Start the game time
    TimeManager.startTime();
  };

  // Callback for when the next day begins
  const onNextDay = (day) => {
    Utils.log(`Day ${day} has begun.`);
  };

  // Handle specific time events
  const handleTimeEvent = (day, time) => {
    // Example: At 06:00 on Day 1, show 'pin-capital' marker
    if (day === 1 && time === '06:00') {
      Markers.showMarker('pin-capital');
      TimeManager.stopTime();
      Utils.log('Marker "pin-capital" displayed at 06:00 on Day 1.');
    }

    // Add more time-based events here as needed
  };

  return {
    init,
    onNextDay,
    handleTimeEvent,
    Resources,
    Reputations,
    TimeManager,
    Markers
  };
})();
