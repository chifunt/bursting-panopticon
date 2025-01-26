// js/markers.js
import { Game } from './game.js';
import { AudioManager } from './audioManager.js';

export const Markers = (() => {
  // List of marker IDs
  const markers = [
    'pin-capital',
    'pin-air',
    'pin-oil',
    'pin-cavitation',
    'pin-gas'
  ];

  // Initialize all markers to be hidden and set up listeners
  const init = () => {
    markers.forEach(markerId => {
      hideMarker(markerId);
      setupClickListener(markerId);
      setupHoverListener(markerId);
    });
  };

  // Show a specific marker
  const showMarker = (markerId) => {
    const marker = document.getElementById(markerId);
    if (marker) {
      marker.querySelector('.pin').style.display = 'block';
      marker.querySelector('.pulse').style.display = 'block';
      console.log(`Marker "${markerId}" is now visible.`);

      // Play 'pin-appear' sound effect
      AudioManager.playSound('pinAppear');
    } else {
      console.warn(`Marker "${markerId}" does not exist.`);
    }
  };

  // Hide a specific marker
  const hideMarker = (markerId) => {
    const marker = document.getElementById(markerId);
    if (marker) {
      marker.querySelector('.pin').style.display = 'none';
      marker.querySelector('.pulse').style.display = 'none';
      console.log(`Marker "${markerId}" is now hidden.`);
    } else {
      console.warn(`Marker "${markerId}" does not exist.`);
    }
  };

  // Setup click listener for a marker
  const setupClickListener = (markerId) => {
    const marker = document.getElementById(markerId);
    if (marker) {
      marker.addEventListener('click', () => {
        // Play 'click' sound effect
        AudioManager.playSound('click');

        // Handle marker click
        handleMarkerClick(markerId);
      });
    } else {
      console.warn(`Marker "${markerId}" does not exist.`);
    }
  };

  // Setup hover listener for a marker
  const setupHoverListener = (markerId) => {
    const marker = document.getElementById(markerId);
    if (marker) {
      marker.addEventListener('mouseenter', () => {
        // Play 'hover' sound effect
        AudioManager.playSound('hover');
      });
    } else {
      console.warn(`Marker "${markerId}" does not exist.`);
    }
  };

  // Handle marker click event by delegating to Game
  const handleMarkerClick = (markerId) => {
    console.log(`Marker "${markerId}" was clicked.`);
    Game.handleMarkerClick(markerId);
  };

  return {
    init,
    showMarker,
    hideMarker,
    hideAllMarkers: () => {
      markers.forEach(markerId => hideMarker(markerId));
    }
  };
})();
