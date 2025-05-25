/**
 * UI Manager Module
 * Handles all user interface interactions, status updates, and visual feedback
 */

class UIManager {
  constructor(gameLogic) {
    this.gameLogic = gameLogic;
    this.squareClass = "square-55d63";
    this.squareToHighlight = null;
    this.colorToHighlight = null;
    this.whiteSquareGrey = "#e2e2e2";
    this.blackSquareGrey = "#969696";
    this.$board = $("#myBoard");
    this.$status = $("#status");

    this.initializeEventListeners();
    this.showWelcomeMessage();
  }

  /**
   * Show welcome message on page load
   */
  showWelcomeMessage() {
    setTimeout(() => {
      this.$status.html(`
        <div class="welcome-message">
          <p><strong>Welcome to Chess Game!</strong></p>
          <p>You play as white. Drag and drop pieces to make your move.</p>
          <p>The AI will respond automatically.</p>
        </div>
      `);
    }, 500);
  }
  /**
   * Initialize event listeners for UI controls
   */
  initializeEventListeners() {
    // New Game button
    $("#startBtn").on("click", () => {
      if (this.gameLogic.isAICurrentlyThinking()) {
        this.showWarning("Please wait for the AI to finish its move.");
        return;
      }
      this.resetGame();
    });

    // Undo button
    $("#undoBtn").on("click", () => {
      if (this.gameLogic.isAICurrentlyThinking()) {
        this.showWarning("Please wait for the AI to finish its move.");
        return;
      }
      this.handleUndo();
    });

    // Redo button
    $("#redoBtn").on("click", () => {
      if (this.gameLogic.isAICurrentlyThinking()) {
        this.showWarning("Please wait for the AI to finish its move.");
        return;
      }
      this.handleRedo();
    });
  }

  /**
   * Handle undo operation
   */
  handleUndo() {
    if (this.gameLogic.canUndo()) {
      this.clearHighlights();
      this.updateStatus("Undoing the last move...");

      // Undo twice: AI's move and player's move
      this.gameLogic.undoMove();
      setTimeout(() => {
        this.gameLogic.undoMove();
        this.updateGameStatus("white");
        if (window.board) {
          window.board.position(this.gameLogic.getFen());
        }
      }, 250);
    } else {
      this.showWarning("Nothing to undo.");
      setTimeout(() => {
        this.updateGameStatus("white");
      }, 1500);
    }
  }

  /**
   * Handle redo operation
   */
  handleRedo() {
    if (this.gameLogic.canRedo()) {
      this.updateStatus("Redoing the last move...");

      // Redo twice: player's move and AI's move
      this.gameLogic.redoMove();
      setTimeout(() => {
        this.gameLogic.redoMove();
        this.updateGameStatus("black");
        if (window.board) {
          window.board.position(this.gameLogic.getFen());
        }
      }, 250);
    } else {
      this.showWarning("Nothing to redo.");
      setTimeout(() => {
        const turn = this.gameLogic.getTurn();
        this.updateGameStatus(turn === "w" ? "white" : "black");
      }, 1500);
    }
  }

  /**
   * Reset the game with visual effects
   */
  resetGame() {
    // Remove any game over effects
    $(".game-status-container .card").removeClass("game-over-pulse");

    this.updateStatus(
      '<i class="fas fa-chess-knight fa-spin mr-2"></i> Setting up the board...'
    );

    // Clear the board with fade effect
    this.$board.fadeTo(300, 0.5, () => {
      // Reset game state
      this.gameLogic.reset();
      this.$board.removeClass("board-disabled");
      this.clearHighlights(); // Update board position
      if (window.board) {
        window.board.position(this.gameLogic.getFen());
      }

      // Fade board back in
      this.$board.fadeTo(300, 1, () => {
        this.updateStatus(
          '<span class="text-success">New game started!</span> You play as white. Make your first move.'
        );
      });
    });
  }

  /**
   * Update the status message
   */
  updateStatus(message) {
    this.$status.html(message);
  }
  /**
   * Show warning message
   */
  showWarning(message) {
    this.updateStatus(`<span class="text-warning">${message}</span>`);
  }

  /**
   * Show info message
   */
  showInfo(message) {
    this.updateStatus(`<span class="text-info">${message}</span>`);
  }

  /**
   * Show error message
   */
  showError(message) {
    this.updateStatus(`<span class="text-danger">${message}</span>`);
  }
  /**
   * Update game status based on current game state
   * Returns true if game is over, false if it continues
   */
  updateGameStatus(currentPlayer) {
    const status = this.gameLogic.getGameStatus();

    switch (status.type) {
      case "checkmate":
        this.showGameOver(status);
        return true;
      case "draw":
        this.showDraw(status);
        return true;
      case "check":
        this.showCheck(status);
        return false;
      case "normal":
        this.showNormalStatus(currentPlayer);
        return false;
      default:
        return false;
    }
  }
  /**
   * Show game over message with animations
   */
  showGameOver(status) {
    let message;
    if (status.winner === "white") {
      message = `<strong class="text-success">Checkmate!</strong> Congratulations, you have won the game!`;
    } else {
      message = `<strong class="text-danger">Checkmate!</strong> The AI has won the game.`;
    }

    this.showAnimatedGameOver(message);
  }
  /**
   * Show draw message
   */
  showDraw(status) {
    let reason;
    switch (status.reason) {
      case "insufficient_material":
        reason = "insufficient material to checkmate";
        break;
      case "threefold_repetition":
        reason = "threefold repetition";
        break;
      case "stalemate":
        reason = "stalemate";
        break;
      case "fifty_move_rule":
        reason = "50-move rule";
        break;
      default:
        reason = "draw";
    }

    const message = `The game ends in a <strong>draw</strong> due to ${reason}.`;
    this.showAnimatedGameOver(message);
  }
  /**
   * Show check message
   */
  showCheck(status) {
    if (status.player === "white") {
      this.updateStatus(
        `<strong class="text-danger">Check!</strong> Your king is under attack. Defend your king!`
      );
    } else {
      this.updateStatus(
        `<strong class="text-success">Check!</strong> The AI's king is under attack.`
      );
    }
  }

  /**
   * Show normal game status
   */
  showNormalStatus(currentPlayer) {
    if (currentPlayer === "white") {
      this.updateStatus(`It's your turn to move. You play as white.`);
    } else {
      this.updateStatus(`AI is thinking about its next move...`);
    }
  }

  /**
   * Show animated game over message
   */
  showAnimatedGameOver(message) {
    this.updateStatus(message);
    $(".game-status-container .card").addClass("game-over-pulse");

    // Add new game button after delay
    setTimeout(() => {
      this.$status.append(
        `<div class="mt-2"><button class="btn btn-sm btn-primary" id="quickNewGame">Start New Game</button></div>`
      );
      $("#quickNewGame").click(() => {
        this.resetGame();
        $(".game-status-container .card").removeClass("game-over-pulse");
      });
    }, 1000);
  }

  /**
   * Set AI thinking visual state
   */
  setAIThinkingState(thinking) {
    if (thinking) {
      this.$board.addClass("board-disabled");
      this.updateStatus(
        `<i class="fas fa-cog fa-spin mr-2"></i> AI is thinking...`
      );
    } else {
      this.$board.removeClass("board-disabled");
    }
  }

  /**
   * Highlight a move on the board
   */
  highlightMove(move, color) {
    this.clearHighlights(color);

    this.$board.find(".square-" + move.from).addClass(`highlight-${color}`);
    this.squareToHighlight = move.to;
    this.colorToHighlight = color;
    this.$board
      .find(".square-" + this.squareToHighlight)
      .addClass(`highlight-${this.colorToHighlight}`);
  }

  /**
   * Clear move highlights
   */
  clearHighlights(color = null) {
    if (color) {
      this.$board
        .find("." + this.squareClass)
        .removeClass(`highlight-${color}`);
    } else {
      this.$board
        .find("." + this.squareClass)
        .removeClass("highlight-white highlight-black");
    }
  }

  /**
   * Remove grey squares (hover effects)
   */
  removeGreySquares() {
    this.$board.find(".square-55d63").css("background", "");
  }

  /**
   * Highlight a square in grey (for hover effects)
   */
  greySquare(square) {
    const $square = this.$board.find(".square-" + square);
    const background = $square.hasClass("black-3c85d")
      ? this.blackSquareGrey
      : this.whiteSquareGrey;
    $square.css("background", background);
  }

  /**
   * Show possible moves for a piece
   */
  showPossibleMoves(square) {
    // Don't show moves if AI is thinking
    if (this.gameLogic.isAICurrentlyThinking()) return;

    const moves = this.gameLogic.getPossibleMoves(square);

    // Exit if no moves available
    if (moves.length === 0) return;

    // Highlight the selected square
    this.greySquare(square);

    // Highlight possible destination squares
    for (let i = 0; i < moves.length; i++) {
      this.greySquare(moves[i].to);
    }
  }

  /**
   * Get the current board jQuery object
   */
  getBoardElement() {
    return this.$board;
  }
}

// Export the class for use in other modules
window.UIManager = UIManager;
