/**
 * Game Logic Module
 * Handles core chess game state, validation, and game flow management
 */

class GameLogic {
  constructor() {
    this.game = new Chess();
    this.globalSum = 0; // Always from black's perspective
    this.isAIThinking = false;
    this.undo_stack = [];
    this.STACK_SIZE = 100; // Maximum size of undo stack
    this.timer = null;
  }

  /**
   * Get the current game instance
   */
  getGame() {
    return this.game;
  }

  /**
   * Get the global evaluation sum
   */
  getGlobalSum() {
    return this.globalSum;
  }

  /**
   * Set the global evaluation sum
   */
  setGlobalSum(sum) {
    this.globalSum = sum;
  }

  /**
   * Check if AI is currently thinking
   */
  isAICurrentlyThinking() {
    return this.isAIThinking;
  }

  /**
   * Set AI thinking state
   */
  setAIThinking(thinking) {
    this.isAIThinking = thinking;
  }

  /**
   * Reset the game to initial state
   */
  reset() {
    this.game.reset();
    this.globalSum = 0;
    this.isAIThinking = false;
    this.undo_stack = [];

    // Clear any timers
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Make a move on the game board
   */
  makeMove(moveData) {
    const move = this.game.move(moveData);
    if (move) {
      // Clear undo stack when a new move is made
      this.undo_stack = [];
    }
    return move;
  }

  /**
   * Undo the last move
   */
  undoMove() {
    const move = this.game.undo();
    if (move) {
      this.undo_stack.push(move);

      // Maintain maximum stack size
      if (this.undo_stack.length > this.STACK_SIZE) {
        this.undo_stack.shift();
      }
    }
    return move;
  }

  /**
   * Redo a previously undone move
   */
  redoMove() {
    if (this.undo_stack.length > 0) {
      const move = this.undo_stack.pop();
      this.game.move(move);
      return move;
    }
    return null;
  }

  /**
   * Check if there are moves to undo
   */
  canUndo() {
    return this.game.history().length >= 2;
  }

  /**
   * Check if there are moves to redo
   */
  canRedo() {
    return this.undo_stack.length >= 2;
  }

  /**
   * Get the current game status
   */
  getGameStatus() {
    if (this.game.in_checkmate()) {
      return {
        type: "checkmate",
        winner: this.game.turn() === "w" ? "black" : "white",
      };
    } else if (this.game.insufficient_material()) {
      return { type: "draw", reason: "insufficient_material" };
    } else if (this.game.in_threefold_repetition()) {
      return { type: "draw", reason: "threefold_repetition" };
    } else if (this.game.in_stalemate()) {
      return { type: "draw", reason: "stalemate" };
    } else if (this.game.in_draw()) {
      return { type: "draw", reason: "fifty_move_rule" };
    } else if (this.game.in_check()) {
      return {
        type: "check",
        player: this.game.turn() === "w" ? "white" : "black",
      };
    } else {
      return {
        type: "normal",
        turn: this.game.turn() === "w" ? "white" : "black",
      };
    }
  }

  /**
   * Check if the game is over
   */
  isGameOver() {
    return this.game.game_over();
  }

  /**
   * Get the current board position as FEN
   */
  getFen() {
    return this.game.fen();
  }

  /**
   * Get possible moves for a square
   */
  getPossibleMoves(square) {
    return this.game.moves({
      square: square,
      verbose: true,
    });
  }

  /**
   * Get all legal moves in the current position
   */
  getAllMoves() {
    return this.game.ugly_moves({ verbose: true });
  }

  /**
   * Get the current turn
   */
  getTurn() {
    return this.game.turn();
  }

  /**
   * Get game history
   */
  getHistory() {
    return this.game.history();
  }
}

// Export the class for use in other modules
window.GameLogic = GameLogic;
