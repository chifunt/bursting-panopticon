import { Utils } from './utils.js';
import { Game } from './game.js';

export const TimeManager = (() => {
  let currentDay = 1;
  let currentTime = { hours: 0, minutes: 0 };
  let timer = null;
  let minuteDuration = 1000; // Default: 1 second per game minute
  let isRunning = false;

  const startTime = () => {
    if (!isRunning) {
      isRunning = true;
      timer = setInterval(incrementTime, minuteDuration);
      Utils.log('Time started.');
    }
  };

  const stopTime = () => {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      Utils.log('Time stopped.');
    }
  };

  const setMinuteDuration = (ms) => {
    minuteDuration = ms;
    Utils.log(`Minute duration set to ${ms} ms.`);
    if (isRunning) {
      stopTime();
      startTime();
    }
  };

  const incrementTime = () => {
    currentTime.minutes += 1;
    if (currentTime.minutes >= 60) {
      currentTime.minutes = 0;
      currentTime.hours += 1;
      if (currentTime.hours >= 24) {
        currentTime.hours = 0;
        nextDay();
      }
    }
    updateDisplay();

    // Notify Game about the current time for event handling
    const formattedTime = getCurrentTime();
    Game.handleTimeEvent(currentDay, formattedTime);
  };

  const nextDay = () => {
    currentDay += 1;
    if (currentDay > 5) {
      currentDay = 5; // Maximum day reached
      stopTime();
      Utils.log('Maximum day reached.');
      return;
    }
    Game.onNextDay(currentDay);
  };

  const updateDisplay = () => {
    const dayElement = document.getElementById('current-day');
    const timeElement = document.getElementById('current-time');

    dayElement.innerText = `DAY ${currentDay}`;
    const formattedHours = String(currentTime.hours).padStart(2, '0');
    const formattedMinutes = String(currentTime.minutes).padStart(2, '0');
    timeElement.innerText = `${formattedHours}:${formattedMinutes}`;
  };

  const getCurrentDay = () => currentDay;
  const getCurrentTime = () => `${String(currentTime.hours).padStart(2, '0')}:${String(currentTime.minutes).padStart(2, '0')}`;

  return {
    startTime,
    stopTime,
    setMinuteDuration,
    getCurrentDay,
    getCurrentTime,
  };
})();
