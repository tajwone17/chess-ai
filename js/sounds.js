/**
 * Sound manager for the chess game
 */

const SoundManager = {
  sounds: {
    move: new Howl({
      src: [
        "https://assets.mixkit.co/sfx/preview/mixkit-plastic-bubble-click-1124.mp3",
      ],
      volume: 0.5,
    }),
    capture: new Howl({
      src: [
        "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3",
      ],
      volume: 0.5,
    }),
    check: new Howl({
      src: [
        "https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3",
      ],
      volume: 0.5,
    }),
    gameOver: new Howl({
      src: [
        "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3",
      ],
      volume: 0.7,
    }),
    newGame: new Howl({
      src: [
        "https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3",
      ],
      volume: 0.5,
    }),
  },

  playSound: function (sound) {
    if (this.sounds[sound]) {
      this.sounds[sound].play();
    }
  },

  // Play the appropriate sound for a move
  playMoveSound: function (move) {
    if (move.captured) {
      this.playSound("capture");
    } else {
      this.playSound("move");
    }
  },
};
