export const Markers = (() => {
  // List of marker IDs
  const markers = [
    'pin-capital',
    'pin-air',
    'pin-oil',
    'pin-cavitation',
    'pin-gas'
  ];

  // Initialize all markers to be hidden
  const init = () => {
    markers.forEach(markerId => {
      hideMarker(markerId);
      setupClickListener(markerId);
    });
  };

  // Show a specific marker
  const showMarker = (markerId) => {
    const marker = document.getElementById(markerId);
    if (marker) {
      marker.querySelector('.pin').style.display = 'block';
      marker.querySelector('.pulse').style.display = 'block';
      console.log(`Marker "${markerId}" is now visible.`);
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

  // Hide all markers
  const hideAllMarkers = () => {
    markers.forEach(markerId => hideMarker(markerId));
  };

  // Setup click listener for a marker
  const setupClickListener = (markerId) => {
    const marker = document.getElementById(markerId);
    if (marker) {
      marker.addEventListener('click', () => {
        handleMarkerClick(markerId);
      });
    } else {
      console.warn(`Marker "${markerId}" does not exist.`);
    }
  };

  // Handle marker click event
  const handleMarkerClick = (markerId) => {
    console.log(`Marker "${markerId}" was clicked.`);
    // Implement additional logic here, such as showing event popups
  };

  return {
    init,
    showMarker,
    hideMarker,
    hideAllMarkers
  };
})();
