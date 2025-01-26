export const AudioManager = (() => {
  // Initialize background music
  const music = new Audio('assets/sounds/music/music.mp3');
  music.loop = true; // Loop the music
  music.volume = 0.5; // Set volume (0.0 to 1.0)

  // Initialize sound effects
  const sounds = {
    pinAppear: new Audio('assets/sounds/sfx/pin-appear.mp3'),
    hover: new Audio('assets/sounds/sfx/hover.mp3'),
    click: new Audio('assets/sounds/sfx/click.mp3'),
  };

  // Preload all sounds
  const preloadSounds = () => {
    music.preload = 'auto';
    Object.values(sounds).forEach(sound => {
      sound.preload = 'auto';
    });
  };

  // Play background music
  const playMusic = () => {
    music.play().catch(error => {
      console.error('Error playing music:', error);
    });
  };

  // Stop background music
  const stopMusic = () => {
    music.pause();
    music.currentTime = 0;
  };

  // Play a specific sound effect
  const playSound = (soundName) => {
    const sound = sounds[soundName];
    if (sound) {
      sound.currentTime = 0; // Rewind to start
      sound.play().catch(error => {
        console.error(`Error playing sound "${soundName}":`, error);
      });
    } else {
      console.warn(`Sound "${soundName}" does not exist.`);
    }
  };

  // Initialize AudioManager
  const init = () => {
    preloadSounds();
  };

  return {
    init,
    playMusic,
    stopMusic,
    playSound,
  };
})();
