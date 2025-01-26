import { Utils } from './utils.js';

export const EndManager = (() => {
  // Select the end screen elements
  const endScreen = document.getElementById('end-screen');
  const endImage = endScreen.querySelector('img');
  const finishButton = endScreen.querySelector('button');

  /**
   * Displays the end screen with the appropriate image based on the ending type.
   * @param {string} endingType - The type of ending to display.
   */
  const showEndScreen = (endingType) => {
    // Determine the image based on the ending type
    switch (endingType) {
      case 'max_day':
        endImage.src = 'assets/images/main-menu.jpg';
        break;
      // Future cases for different endings can be added here
      default:
        endImage.src = 'assets/images/main-menu.jpg';
    }

    // Display the end screen
    endScreen.style.display = 'flex';
    Utils.log('End screen displayed.');

    // Add event listener to the finish button
    finishButton.addEventListener(
      'click',
      () => {
        finishGame();
      },
      { once: true } // Ensures the listener is only called once
    );
  };

  /**
   * Handles the game finish action.
   */
  const finishGame = () => {
    Utils.log('Game finished.');
    // Redirect to the main menu or reload the game
    window.location.reload();
  };

  return {
    showEndScreen,
  };
})();
