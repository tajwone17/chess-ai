# Chess Game: A Complete Beginner's Guide

Welcome to our interactive Chess Game! This guide will walk you through all the important components of the application, explaining how everything works in beginner-friendly terms. Whether you're a chess enthusiast or just starting, this document will help you understand the underlying code and game mechanics.

## Table of Contents

1. [Game Overview](#game-overview)
2. [Project Structure](#project-structure)
3. [Main Components](#main-components)
4. [Game Logic Explained](#game-logic-explained)
5. [User Interface Components](#user-interface-components)
6. [Board Interactions](#board-interactions)
7. [Chess AI System](#chess-ai-system)
8. [How to Play](#how-to-play)
9. [Understanding the Code](#understanding-the-code)

## Game Overview

This Chess Game allows you to play chess against an AI opponent. You play as the white pieces, and the AI controls the black pieces. The game features a graphical chessboard where you can drag and drop pieces to make moves, undo/redo functionality, and a status display that keeps you informed about the game state.

![Chess Game Interface](img/chesspieces/wikipedia/wN.png)

## Project Structure

The project follows a modular structure where each component handles a specific responsibility:

- **index.html**: The main HTML file that displays the game interface
- **main.js**: Coordinates all the game modules
- **game-logic.js**: Handles the core chess rules and game state
- **ui-manager.js**: Manages the user interface and visual feedback
- **board-interactions.js**: Controls the chessboard interactions and piece movements
- **chess-ai.js**: Contains the AI opponent logic and decision-making algorithms

## Main Components

### 1. Main.js - Game Coordinator

This is the starting point of the application that brings all components together.

**Key Functions:**

- **`initializeGame()`**: Creates instances of all game modules and connects them together

  ```javascript
  function initializeGame() {
    // Initialize core modules
    gameLogic = new GameLogic();
    chessAI = new ChessAI();
    uiManager = new UIManager(gameLogic);
    boardInteractions = new BoardInteractions(gameLogic, uiManager, chessAI);

    // Initialize the chessboard
    boardInteractions.initializeBoard();
  }
  ```

- **Document Ready Handler**: Starts the game when the page is fully loaded
  ```javascript
  $(document).ready(function () {
    setTimeout(() => {
      initializeGame();
    }, 100);
  });
  ```

### 2. Game Logic Module

Handles all the chess rules, game state, move validation, and game flow management.

**Key Functions:**

- **`makeMove(moveData)`**: Attempts to make a chess move and validates it

  ```javascript
  makeMove(moveData) {
    const move = this.game.move(moveData);
    if (move) {
      // Clear undo stack when a new move is made
      this.undo_stack = [];
    }
    return move;
  }
  ```

- **`undoMove()`**: Reverses the last move made

  ```javascript
  undoMove() {
    const move = this.game.undo();
    if (move) {
      this.undo_stack.push(move);
    }
    return move;
  }
  ```

- **`reset()`**: Resets the game to its initial state

  ```javascript
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
  ```

- **`isGameOver()`**: Checks if the game has ended
- **`getTurn()`**: Returns which player's turn it is ('w' for white, 'b' for black)
- **`getFen()`**: Gets the current board position in FEN notation

## Game Logic Explained

### Chess Game State

The game state is managed using the [chess.js](https://github.com/jhlywa/chess.js) library, which handles:

1. **Legal Move Validation**: Ensures players only make legal chess moves
2. **Check/Checkmate Detection**: Recognizes when a king is in check or checkmate
3. **Draw Detection**: Identifies stalemate, threefold repetition, and other draw conditions
4. **Move History**: Keeps track of all moves made during the game

### The Undo/Redo System

The game implements an undo/redo system that allows players to:

1. **Undo Moves**: Go back in the game history (both your move and the AI's response)
2. **Redo Moves**: Replay previously undone moves

The system uses two stacks:

- `game.history()` - Built-in chess.js history
- `undo_stack` - Custom stack for redo functionality

## User Interface Components

The UI Manager handles all visual elements and user feedback.

**Key Functions:**

- **`updateGameStatus(playerColor)`**: Updates the game status message based on the current state

  ```javascript
  updateGameStatus(playerColor) {
    const game = this.gameLogic.getGame();
    let statusText = "";

    if (game.in_checkmate()) {
      statusText = `Game over! ${playerColor === "white" ? "Black" : "White"} wins by checkmate.`;
      return true; // Game is over
    } else if (game.in_draw()) {
      statusText = "Game over! It's a draw.";
      return true; // Game is over
    } else if (game.in_check()) {
      statusText = `${playerColor === "white" ? "White" : "Black"} is in check!`;
    } else {
      statusText = `${playerColor === "white" ? "White" : "Black"} to move.`;
    }

    this.updateStatus(statusText);
    return false; // Game continues
  }
  ```

- **`highlightMove(move, playerColor)`**: Highlights the squares involved in the last move

  ```javascript
  highlightMove(move, playerColor) {
    // Remove previous highlights
    this.clearHighlights();

    // Highlight the from square
    const $fromSquare = $(`.square-${move.from}`);
    $fromSquare.addClass("highlight-" + playerColor);

    // Highlight the to square
    const $toSquare = $(`.square-${move.to}`);
    $toSquare.addClass("highlight-" + playerColor);

    // Store highlighted squares for later clearing
    this.squareToHighlight = move.to;
    this.colorToHighlight = playerColor;
  }
  ```

- **`showLegalMoves(square, moves)`**: Shows visual indicators for legal moves when hovering over a piece
- **`removeGreySquares()`**: Clears the legal move indicators
- **`showWarning(message)`**: Displays a warning message to the user

## Board Interactions

The Board Interactions module handles all the chessboard events and piece movements.

**Key Functions:**

- **`initializeBoard()`**: Sets up the chessboard with initial position and event handlers

  ```javascript
  initializeBoard() {
    window.board = Chessboard("myBoard", this.config);
    return window.board;
  }
  ```

- **`onDragStart(source, piece)`**: Called when a player starts dragging a piece

  ```javascript
  onDragStart(source, piece) {
    // Don't pick up pieces if game is over
    if (this.gameLogic.isGameOver()) return false;

    // Don't pick up pieces if AI is thinking
    if (this.gameLogic.isAICurrentlyThinking()) {
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
  ```

- **`onDrop(source, target)`**: Called when a player releases a piece on a square

  ```javascript
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
      return "snapback";
    }

    // If move is legal, update UI and let AI respond
    this.uiManager.highlightMove(move, "white");

    const gameIsOver = this.uiManager.updateGameStatus("black");
    if (!gameIsOver) {
      this.scheduleAIMove();
    }
  }
  ```

- **`scheduleAIMove()`**: Schedules the AI to make its move after a short delay
- **`onMouseoverSquare(square, piece)`**: Shows legal moves when hovering over a piece
- **`onMouseoutSquare()`**: Clears legal move indicators when moving away from a piece

## Chess AI System

The Chess AI uses the minimax algorithm with alpha-beta pruning to make intelligent decisions.

**Key Concepts:**

### 1. Board Evaluation

The AI evaluates board positions using piece values and positional tables:

```javascript
evaluateBoard(game, move, prevSum, color) {
  // Check for game ending conditions
  if (game.in_checkmate()) {
    if (move.color === color) {
      return 10 ** 10; // We win
    } else {
      return -(10 ** 10); // We lose
    }
  }

  // More evaluation logic...
}
```

### 2. Piece Values

Each piece has an assigned value:

- Pawn: 100 points
- Knight: 280 points
- Bishop: 320 points
- Rook: 479 points
- Queen: 929 points
- King: 60,000 points

### 3. Position Tables

The AI considers not just the pieces but their positions. For example, a knight is more valuable in the center of the board than at the edge:

```javascript
// Knight position table (partial)
n: [
  [-66, -53, -75, -75, -10, -55, -58, -70],
  [-3, -6, 100, -36, 4, 62, -4, -14],
  [10, 67, 1, 74, 73, 27, 62, -2],
  // ... more rows
];
```

### 4. Minimax Algorithm

The core AI decision-making algorithm:

```javascript
minimax(game, depth, alpha, beta, isMaximizingPlayer, sum, color) {
  this.positionCount++;
  var children = game.ugly_moves({ verbose: true });

  // Base case: maximum depth or no moves
  if (depth === 0 || children.length === 0) {
    return [null, sum];
  }

  // Try each possible move and find the best one
  // ... algorithm logic
}
```

- **Depth**: How many moves ahead to look (typically 3)
- **Alpha-Beta Pruning**: Optimization technique to avoid evaluating obviously bad moves
- **Maximizing vs. Minimizing**: The AI alternates between maximizing its score and minimizing the opponent's score

## How to Play

1. **Start a New Game**: Click the "New Game" button to reset the board
2. **Make a Move**: Drag and drop a white piece to a legal square
3. **AI Response**: The AI will automatically respond with a black piece move
4. **Special Moves**:
   - Castling: Drag the king two squares towards a rook
   - Pawn promotion: Move a pawn to the last rank (automatically promotes to a queen)
5. **Undo/Redo**: Use the buttons below the board to take back or replay moves
6. **Game End**: The game ends when there's a checkmate, stalemate, or other draw condition

## Understanding the Code

### Event Flow

When you make a move, here's the sequence of events:

1. `onDrop()` in BoardInteractions handles the piece being dropped
2. `makeMove()` in GameLogic validates and applies the move
3. `updateGameStatus()` in UIManager updates the status display
4. `scheduleAIMove()` in BoardInteractions triggers the AI to think
5. AI's `getBestMove()` calculates the best response
6. AI makes its move, and the cycle continues

### Important JavaScript Patterns Used

1. **Class-based Organization**: Each module is a JavaScript class with specific responsibilities
2. **Event Delegation**: Events are handled through callbacks
3. **Method Binding**: `this` context is preserved using `.bind(this)` for event handlers
4. **Promise-like Delays**: `setTimeout()` is used to create delays for better UX
5. **State Management**: Game state is centralized in the GameLogic module

---

We hope this guide helps you understand and enjoy the Chess Game! Whether you're learning to play chess or interested in how the code works, this project demonstrates many important programming concepts in an interactive way.

Happy playing! ♟️
