/**
 * Sound manager for the chess game
 */

const SoundManager = {
  initialized: false,
  enabled: true,
  sounds: {},
  // Initialize sound system
  init: function () {
    console.log("Initializing SoundManager...");

    // Check if Howler is available
    if (typeof Howl === "undefined") {
      console.error("Howler.js not loaded! Using fallback audio system.");
      this.initFallbackAudio();
      return;
    }

    try {
      // Create sound objects with local files and fallbacks
      this.sounds = {
        move: new Howl({
          src: ["sounds/move.mp3"],
          volume: 0.5,
          onload: () => console.log("Move sound loaded successfully"),
          onloaderror: (id, error) => {
            console.warn("Failed to load move sound:", error);
            // Fallback to a simple beep or no sound
            this.sounds.move = {
              play: () => console.log("Move sound (fallback)"),
            };
          },
          onplayerror: (id, error) =>
            console.warn("Failed to play move sound:", error),
        }),
        capture: new Howl({
          src: ["sounds/capture.mp3"],
          volume: 0.6,
          onload: () => console.log("Capture sound loaded successfully"),
          onloaderror: (id, error) => {
            console.warn("Failed to load capture sound:", error);
            // Use move sound as fallback
            this.sounds.capture = this.sounds.move;
          },
          onplayerror: (id, error) =>
            console.warn("Failed to play capture sound:", error),
        }),
        check: new Howl({
          src: ["sounds/check.mp3"],
          volume: 0.7,
          onload: () => console.log("Check sound loaded successfully"),
          onloaderror: (id, error) => {
            console.warn("Failed to load check sound:", error);
            // Use move sound as fallback
            this.sounds.check = this.sounds.move;
          },
          onplayerror: (id, error) =>
            console.warn("Failed to play check sound:", error),
        }),
        gameOver: new Howl({
          src: ["sounds/gameover.mp3"],
          volume: 0.7,
          onload: () => console.log("Game over sound loaded successfully"),
          onloaderror: (id, error) => {
            console.warn("Failed to load gameOver sound:", error);
            // Use move sound as fallback
            this.sounds.gameOver = this.sounds.move;
          },
          onplayerror: (id, error) =>
            console.warn("Failed to play gameOver sound:", error),
        }),
        newGame: new Howl({
          src: ["sounds/newgame.mp3"],
          volume: 0.6,
          onload: () => console.log("New game sound loaded successfully"),
          onloaderror: (id, error) => {
            console.warn("Failed to load newGame sound:", error);
            // Use move sound as fallback
            this.sounds.newGame = this.sounds.move;
          },
          onplayerror: (id, error) =>
            console.warn("Failed to play newGame sound:", error),
        }),
      };

      this.initialized = true;
      console.log("SoundManager initialized successfully!");
    } catch (error) {
      console.error("Error initializing SoundManager:", error);
      this.enabled = false;
    }
  },
  playSound: function (sound) {
    // Use the enhanced play function
    this.playEnhanced(sound);
  },
  // Play the appropriate sound for a move
  playMoveSound: function (move) {
    if (move.captured) {
      this.playSound("capture");
    } else {
      this.playSound("move");
    }
  }, // Test function to verify sound system is working
  testSounds: function () {
    console.log("Testing sound system...");
    console.log("Enabled:", this.enabled);
    console.log("Initialized:", this.initialized);
    console.log("Available sounds:", Object.keys(this.sounds));

    if (this.enabled) {
      if (!this.initialized) {
        console.log("Initializing sound system for test...");
        this.init();
      }
      console.log("Playing test sound...");
      this.playEnhanced("move");
    }
  },

  // Fallback audio system using HTML5 Audio
  initFallbackAudio: function () {
    console.log("Initializing fallback audio system...");

    try {
      this.sounds = {
        move: new Audio("sounds/move.mp3"),
        capture: new Audio("sounds/capture.mp3"),
        check: new Audio("sounds/check.mp3"),
        gameOver: new Audio("sounds/gameover.mp3"),
        newGame: new Audio("sounds/newgame.mp3"),
      };

      // Set volume for all sounds
      Object.values(this.sounds).forEach((audio) => {
        audio.volume = 0.5;
        audio.preload = "auto";
      });

      this.initialized = true;
      console.log("Fallback audio system initialized successfully!");
    } catch (error) {
      console.error("Error initializing fallback audio:", error);
      this.enabled = false;
    }
  },

  // Enhanced play function that works with both Howler and fallback
  playEnhanced: function (sound) {
    if (!this.enabled || !this.initialized) {
      console.log(`Sound disabled or not initialized, would play: ${sound}`);
      return;
    }

    if (this.sounds[sound]) {
      console.log(`Playing sound: ${sound}`);
      try {
        if (typeof this.sounds[sound].play === "function") {
          // For both Howler and HTML5 Audio
          const playPromise = this.sounds[sound].play();

          // Handle promise-based play (modern browsers)
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn(`Error playing sound ${sound}:`, error);
            });
          }
        }
      } catch (error) {
        console.error(`Error playing sound ${sound}:`, error);
      }
    } else {
      console.warn(`Sound not found: ${sound}`);
    }
  },
};
