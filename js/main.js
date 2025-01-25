import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  Game.init();
  Game.TimeManager.setMinuteDuration(2);
  setupEventListeners();
});

const setupEventListeners = () => {
  const minimizeButton = document.querySelector('.minimize-button');
  const eventPopup = document.querySelector('.event-popup');

  minimizeButton.addEventListener('click', () => {
    eventPopup.style.display = 'none';
  });

  const decisionButton = document.querySelector('.event-buttons-container button');
  decisionButton.addEventListener('click', () => {
    // Handle decision logic here
    eventPopup.style.display = 'none';
    TimeManager.startTime(); // Resume time
  });
};
