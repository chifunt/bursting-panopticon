import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  Game.init();
  Game.TimeManager.setMinuteDuration(2);
});
