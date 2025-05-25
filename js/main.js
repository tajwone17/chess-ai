/**
 * Main Chess Game Coordinator
 * Initializes and coordinates all game modules
 */

// Main game components
let gameLogic;
let uiManager;
let boardInteractions;
let chessAI;

/**
 * Initialize the chess game
 */
function initializeGame() {
  try {
    // Initialize core modules
    gameLogic = new GameLogic();
    chessAI = new ChessAI();
    uiManager = new UIManager(gameLogic);
    boardInteractions = new BoardInteractions(gameLogic, uiManager, chessAI);

    // Initialize the chessboard
    boardInteractions.initializeBoard();

    console.log("Chess game initialized successfully!");
  } catch (error) {
    console.error("Error initializing chess game:", error);

    // Show error message to user
    $("#status").html(
      '<span class="text-danger">Error starting game. Please refresh the page.</span>'
    );
  }
}

/**
 * Start the game when the page is ready
 */
$(document).ready(function () {
  // Wait for all scripts to load
  setTimeout(() => {
    initializeGame();
  }, 100);
});
