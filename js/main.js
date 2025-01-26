import { Game } from './game.js';
import { AudioManager } from './audioManager.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AudioManager
  AudioManager.init();

  // Get the Begin button
  const beginButton = document.querySelector('#menu-screen button');
  beginButton.addEventListener('click', () => {
    // Play background music
    AudioManager.playMusic();
    AudioManager.playSound('click');

    // Hide the menu screen
    document.getElementById('menu-screen').style.display = 'none';

    // Initialize and start the game
    Game.init();
    Game.TimeManager.setMinuteDuration(2);
  });
});
