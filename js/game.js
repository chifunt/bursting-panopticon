import { Resources } from './resources.js';
import { Reputations } from './reputations.js';
import { TimeManager } from './timeManager.js';
import { Utils } from './utils.js';

export const Game = (() => {
  const debugMode = true;
  Utils.setDebugMode(debugMode);

  // Initialize game state
  const init = () => {
    Utils.log('Game initialized.');

    // Initialize Resources and Reputations in the DOM
    Resources.init();
    Reputations.init();

    // Start the game time
    TimeManager.startTime();
  };

  // Callback for when the next day begins
  const onNextDay = (day) => {
    Utils.log(`Day ${day} has begun.`);
  };

  return {
    init,
    onNextDay,
    Resources,
    Reputations,
    TimeManager,
  };
})();
