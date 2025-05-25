/**
 * Board Interactions Module
 * Handles all chessboard.js event handlers and piece interactions
 */

class BoardInteractions {
  constructor(gameLogic, uiManager, chessAI) {
    this.gameLogic = gameLogic;
    this.uiManager = uiManager;
    this.chessAI = chessAI;

    // Board configuration
    this.config = {
      draggable: true,
      position: "start",
      pieceTheme: "img/chesspieces/wikipedia/{piece}.png",
      showNotation: true,
      boardTheme: "forest",
      moveSpeed: 300,
      snapbackSpeed: 300,
      snapSpeed: 100,
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onMouseoutSquare: this.onMouseoutSquare.bind(this),
      onMouseoverSquare: this.onMouseoverSquare.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this),
    };
  }

  /**
   * Initialize the chessboard
   */
  initializeBoard() {
    window.board = Chessboard("myBoard", this.config);
    return window.board;
  }

  /**
   * Handle drag start event
   */
  onDragStart(source, piece) {
    // Don't pick up pieces if game is over
    if (this.gameLogic.isGameOver()) return false;

    // Don't pick up pieces if AI is thinking
    if (this.gameLogic.isAICurrentlyThinking()) {
      this.uiManager.showWarning("Please wait for the AI to finish its move.");
      return false;
    }

    // Don't allow moving opponent's pieces
    const turn = this.gameLogic.getTurn();
    if (
      (turn === "w" && piece.search(/^b/) !== -1) ||
      (turn === "b" && piece.search(/^w/) !== -1)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Handle piece drop event
   */
  onDrop(source, target) {
    this.uiManager.removeGreySquares();

    // Attempt to make the move
    const move = this.gameLogic.makeMove({
      from: source,
      to: target,
      promotion: "q", // Always promote to queen for simplicity
    });

    // Handle illegal move
    if (move === null) {
      this.uiManager.updateStatus(
        '<span class="text-danger">Illegal move. Try again.</span>'
      );
      setTimeout(() => {
        this.uiManager.updateGameStatus("white");
      }, 1500);
      return "snapback";
    } // Update evaluation
    this.gameLogic.setGlobalSum(
      this.chessAI.evaluateBoard(
        this.gameLogic.getGame(),
        move,
        this.gameLogic.getGlobalSum(),
        "b"
      )
    );

    // Highlight the player's move
    this.uiManager.highlightMove(move, "white"); // Check if game continues and let AI make its move
    const gameIsOver = this.uiManager.updateGameStatus("black");
    if (!gameIsOver) {
      this.scheduleAIMove();
    }
  }

  /**
   * Handle mouse over square event
   */
  onMouseoverSquare(square, piece) {
    this.uiManager.showPossibleMoves(square);
  }

  /**
   * Handle mouse out square event
   */
  onMouseoutSquare(square, piece) {
    this.uiManager.removeGreySquares();
  }

  /**
   * Handle snap end event
   */
  onSnapEnd() {
    window.board.position(this.gameLogic.getFen());
  }

  /**
   * Schedule AI move with visual feedback
   */
  scheduleAIMove() {
    // Set AI thinking state
    this.gameLogic.setAIThinking(true);
    this.uiManager.setAIThinkingState(true);

    // Make AI move after a delay to show "thinking"
    setTimeout(() => {
      this.makeAIMove();
    }, 750);
  }

  /**
   * Make the AI move
   */
  makeAIMove() {
    try {
      const color = "b"; // AI always plays black
      const currentSum = this.gameLogic.getGlobalSum();

      // Get best move from AI
      const [bestMove, bestMoveValue] = this.chessAI.getBestMove(
        this.gameLogic.getGame(),
        color,
        currentSum
      );

      if (bestMove) {
        // Update evaluation
        this.gameLogic.setGlobalSum(
          this.chessAI.evaluateBoard(
            this.gameLogic.getGame(),
            bestMove,
            currentSum,
            "b"
          )
        ); // Make the move
        this.gameLogic.getGame().move(bestMove);
        window.board.position(this.gameLogic.getFen());

        // Highlight AI move
        this.uiManager.highlightMove(bestMove, "black");

        // Update game status
        this.uiManager.updateGameStatus("black");
      }
    } catch (error) {
      console.error("Error making AI move:", error);
      this.uiManager.updateStatus(
        '<span class="text-danger">AI encountered an error. Please try again.</span>'
      );
    } finally {
      // Reset AI thinking state
      this.gameLogic.setAIThinking(false);
      this.uiManager.setAIThinkingState(false);
    }
  }

  /**
   * Get the current board instance
   */
  getBoard() {
    return window.board;
  }

  /**
   * Update board position
   */
  updateBoardPosition() {
    if (window.board) {
      window.board.position(this.gameLogic.getFen());
    }
  }
}

// Export the class for use in other modules
window.BoardInteractions = BoardInteractions;
