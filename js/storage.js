/**
 * Functions to handle local storage and saving/loading game state
 */

// Save current game state to local storage
function saveGameToStorage() {
  const gameState = {
    fen: game.fen(),
    history: game.history({ verbose: true }),
    isAIThinking: isAIThinking,
    undo_stack: undo_stack,
  };

  try {
    localStorage.setItem("chessGameState", JSON.stringify(gameState));
  } catch (e) {
    console.error("Error saving game state to local storage:", e);
  }
}

// Load saved game state from local storage
function loadGameFromStorage() {
  try {
    const savedState = localStorage.getItem("chessGameState");

    if (!savedState) return;

    const gameState = JSON.parse(savedState);

    // Load the position
    game.load(gameState.fen);
    board.position(gameState.fen);

    // Recreate the history
    if (gameState.history && gameState.history.length > 0) {
      // Update move history UI if available
      if (typeof MoveHistoryManager !== "undefined") {
        gameState.history.forEach((move) => {
          MoveHistoryManager.addMove(move, game.fen());
        });
      }
    }

    // Restore AI thinking state
    isAIThinking = gameState.isAIThinking || false;

    // Restore undo stack
    undo_stack = gameState.undo_stack || [];

    // Update board visual state
    if (isAIThinking) {
      $("#myBoard").addClass("board-disabled");
    }

    // Check current game status
    checkStatus(game.turn() === "w" ? "white" : "black");

    // Start timer if game has started
    if (gameState.history && gameState.history.length > 0) {
      if (typeof GameTimer !== "undefined") {
        GameTimer.start();
      }
    }
  } catch (e) {
    console.error("Error loading game state from local storage:", e);
  }
}

// Clear saved game state
function clearSavedGame() {
  try {
    localStorage.removeItem("chessGameState");
  } catch (e) {
    console.error("Error clearing saved game state:", e);
  }
}
