// Sound options for the app
export interface SoundOption {
  id: string;
  name: string;
  path: string;
}

// External sound URLs
const SOUND_URLS = {
  beep: 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3',
  bell: 'src/utils/mixkit-retro-game-emergency-alarm-1000.wav',
  chime: 'src/utils/mixkit-warning-alarm-buzzer-991.wav'
};

// Available sounds
export const SOUNDS: SoundOption[] = [
  {
    id: 'beep',
    name: 'Digital Beep',
    path: SOUND_URLS.beep
  },
  {
    id: 'bell',
    name: 'Alarm Bell',
    path: SOUND_URLS.bell
  },
  {
    id: 'chime',
    name: 'Bell Chime',
    path: SOUND_URLS.chime
  },
  {
    id: 'none',
    name: 'No Sound',
    path: ''
  }
];

// Get a sound by ID
export const getSoundById = (id: string): SoundOption => {
  return SOUNDS.find(sound => sound.id === id) || SOUNDS[0];
};

// Create and cache audio elements
const audioCache: { [key: string]: HTMLAudioElement } = {};

// Initialize audio elements
const initializeAudio = (soundId: string): HTMLAudioElement => {
  if (!audioCache[soundId]) {
    const sound = getSoundById(soundId);
    const audio = new Audio(sound.path);
    audio.preload = 'auto';
    audioCache[soundId] = audio;
  }
  return audioCache[soundId];
};

// Stop all sounds
export const stopAllSounds = (): void => {
  Object.values(audioCache).forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
};

// Play a sound
export const playSound = async (soundId: string, volume = 0.7): Promise<void> => {
  if (soundId === 'none') return;

  try {
    // Stop any currently playing sounds
    stopAllSounds();
    
    const audio = initializeAudio(soundId);
    audio.volume = volume;
    
    // Try to play the sound
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing sound:', error);
        // If autoplay is blocked, try to play on next user interaction
        if (error.name === 'NotAllowedError') {
          const playOnInteraction = () => {
            audio.play().catch(console.error);
            document.removeEventListener('click', playOnInteraction);
          };
          document.addEventListener('click', playOnInteraction);
        }
      });
    }
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}; 