/**
 * Game Timer for Chess Game
 * Tracks time for both players
 */

const GameTimer = {
  // Initialize the timers
  init: function (startTimeInSeconds = 600) {
    // Default 10 minutes
    this.whiteTime = startTimeInSeconds;
    this.blackTime = startTimeInSeconds;
    this.activeColor = "white"; // White starts
    this.isRunning = false;
    this.timerInterval = null;
    this.render();
  },

  // Start the timer
  start: function () {
    if (this.isRunning) return;

    this.isRunning = true;
    this.timerInterval = setInterval(() => {
      if (this.activeColor === "white") {
        this.whiteTime -= 1;
      } else {
        this.blackTime -= 1;
      }

      // Check for time out
      if (this.whiteTime <= 0 || this.blackTime <= 0) {
        this.stop();
        const winner = this.whiteTime <= 0 ? "Black" : "White";
        $("#status").html(
          `<span class="text-warning">${winner} wins on time!</span>`
        );
      }

      this.render();
    }, 1000);
  },

  // Stop the timer
  stop: function () {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  },

  // Switch active player
  switchPlayer: function () {
    this.activeColor = this.activeColor === "white" ? "black" : "white";
    this.render();
  },

  // Reset the timer
  reset: function (startTimeInSeconds = 600) {
    this.stop();
    this.whiteTime = startTimeInSeconds;
    this.blackTime = startTimeInSeconds;
    this.activeColor = "white";
    this.render();
  },

  // Format seconds to MM:SS
  formatTime: function (seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  },

  // Render the timers
  render: function () {
    const $whiteTimer = $(".white-timer");
    const $blackTimer = $(".black-timer");

    $whiteTimer.text(this.formatTime(this.whiteTime));
    $blackTimer.text(this.formatTime(this.blackTime));

    // Highlight active timer
    $whiteTimer.toggleClass(
      "active-timer",
      this.activeColor === "white" && this.isRunning
    );
    $blackTimer.toggleClass(
      "active-timer",
      this.activeColor === "black" && this.isRunning
    );
  },
};
