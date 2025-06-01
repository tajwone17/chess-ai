# Human vs AI Chess Game - Beginner's Guide

This guide explains every part of the chess game implementation in simple terms. It's designed to help beginners understand how the code works, particularly focusing on the AI opponent that uses the minimax algorithm.

## Table of Contents

1. [HTML Structure](#html-structure)
2. [CSS Styling](#css-styling)
3. [JavaScript Implementation](#javascript-implementation)
    - [Game Setup](#game-setup)
    - [Board Rendering](#board-rendering)
    - [User Interaction](#user-interaction)
    - [AI Implementation](#ai-implementation)
    - [Minimax Algorithm](#minimax-algorithm)
    - [Alpha-Beta Pruning](#alpha-beta-pruning)
    - [Board Evaluation](#board-evaluation)
    - [Chess Rules Implementation](#chess-rules-implementation)
4. [How to Play](#how-to-play)
5. [Possible Improvements](#possible-improvements)
6. [Advanced Improvements for Chess AI](#advanced-improvements-for-chess-ai)
7. [Conclusion](#conclusion)

## HTML Structure

The HTML file (`index.html`) provides the basic structure for our chess game:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Chess Game</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Human vs AI Chess Game</h1>
        <div class="game-info">
            <div id="status">Your turn (White)</div>
            <button id="restart-btn">Restart Game</button>
        </div>
        <div id="board" class="chess-board"></div>
        <div class="settings">
            <label for="difficulty">AI Difficulty (Search Depth):</label>
            <select id="difficulty">
                <option value="1">Easy (Depth 1)</option>
                <option value="2" selected>Medium (Depth 2)</option>
                <option value="3">Hard (Depth 3)</option>
            </select>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### Explanation:

- **Document Structure**: The standard HTML5 document structure with `<!DOCTYPE html>` declaration.
- **Head Section**: Contains metadata, title, and links to the CSS file.
- **Body Section**: Contains the main content of our chess game.
- **Container**: A wrapper div to hold all our game elements.
- **Game Info**: Displays the current status of the game and the restart button.
- **Chess Board**: An empty div with ID "board" that will be filled with squares using JavaScript.
- **Settings**: A dropdown to select the difficulty level of the AI.
- **JavaScript Link**: Loads the script.js file at the end of the body.

## CSS Styling

The CSS file (`styles.css`) provides styling for our chess game:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    padding: 20px;
}

.container {
    max-width: 600px;
    width: 100%;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

/* ... more CSS ... */

.chess-board {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    width: 100%;
    aspect-ratio: 1 / 1;
    border: 2px solid #333;
    margin-bottom: 20px;
}

.square {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.white {
    background-color: #f0d9b5;
}

.black {
    background-color: #b58863;
}

.square.selected {
    background-color: #aec6cf;
}

.square.valid-move {
    position: relative;
}

.square.valid-move::after {
    content: "";
    position: absolute;
    width: 25%;
    height: 25%;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
}
```

### Explanation:

- **Reset Styles**: The `*` selector resets margin, padding, and box-sizing for all elements.
- **Body Styling**: Centers the content on the page with a light gray background.
- **Container**: Styles the main container with a white background, rounded corners, and a shadow.
- **Chess Board**: Uses CSS Grid to create an 8x8 grid for the chess board.
- **Square Styling**: Styles each square on the board, with different colors for white and black squares.
- **Selected Square**: Highlights the currently selected piece with a blue background.
- **Valid Move Indicator**: Shows a small dot on squares where the selected piece can move.

## JavaScript Implementation

The JavaScript file (`script.js`) contains all the game logic, including chess rules and the AI opponent. Let's break it down section by section:

### Game Setup

```javascript
// Chess pieces Unicode characters
const PIECES = {
    'white': {
        'pawn': '♙',
        'rook': '♖',
        'knight': '♘',
        'bishop': '♗',
        'queen': '♕',
        'king': '♔'
    },
    'black': {
        'pawn': '♟',
        'rook': '♜',
        'knight': '♞',
        'bishop': '♝',
        'queen': '♛',
        'king': '♚'
    }
};

// Initial board setup
const INITIAL_BOARD = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
];

// Game state
let board = [];
let selectedPiece = null;
let currentPlayer = 'white';
let validMoves = [];
let gameOver = false;

// DOM elements
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
```

### Explanation:

- **Chess Pieces**: A dictionary of Unicode symbols for each chess piece. These symbols will be displayed on the board.
- **Initial Board**: A 2D array representing the starting position of a chess game. Each piece is represented by a two-character code:
  - First character: 'w' for white, 'b' for black
  - Second character: 'p' for pawn, 'r' for rook, 'n' for knight, 'b' for bishop, 'q' for queen, 'k' for king
  - Empty squares are represented by empty strings.
- **Game State Variables**: 
  - `board`: The current state of the board
  - `selectedPiece`: The currently selected piece (if any)
  - `currentPlayer`: Whose turn it is ('white' or 'black')
  - `validMoves`: A list of valid moves for the selected piece
  - `gameOver`: Whether the game has ended
- **DOM Elements**: References to HTML elements that we'll need to update as the game progresses.

### Game Initialization

```javascript
// Initialize the game
function initGame() {
    board = JSON.parse(JSON.stringify(INITIAL_BOARD));
    selectedPiece = null;
    currentPlayer = 'white';
    validMoves = [];
    gameOver = false;
    statusElement.textContent = 'Your turn (White)';
    renderBoard();
}
```

### Explanation:

- **Deep Copy**: `JSON.parse(JSON.stringify(INITIAL_BOARD))` creates a deep copy of the initial board, so we can reset the game without affecting the original.
- **Reset Variables**: Clear all game state variables to their starting values.
- **Update Status**: Set the status text to indicate it's the player's turn.
- **Render Board**: Call the function to display the board on the screen.

### Board Rendering

```javascript
// Render the chess board
function renderBoard() {
    boardElement.innerHTML = '';

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
            square.dataset.row = row;
            square.dataset.col = col;

            if (board[row][col]) {
                const piece = board[row][col];
                const color = piece[0] === 'w' ? 'white' : 'black';
                const type = getPieceType(piece[1]);
                square.textContent = PIECES[color][type];
            }

            if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
                square.classList.add('selected');
            }

            if (validMoves.some(move => move.row === row && move.col === col)) {
                square.classList.add('valid-move');
            }

            square.addEventListener('click', () => handleSquareClick(row, col));
            boardElement.appendChild(square);
        }
    }
}
```

### Explanation:

- **Clear Board**: Empty the board element to start fresh.
- **Create Squares**: Create 64 div elements (8×8) for the chess board.
- **Alternating Colors**: Use the formula `(row + col) % 2 === 0` to determine if a square should be white or black.
- **Store Position**: Save the row and column in the dataset for later use.
- **Add Pieces**: If a square has a piece, display its Unicode symbol.
- **Highlight Selected**: If a piece is selected, add the 'selected' class to highlight it.
- **Show Valid Moves**: If a square is a valid move for the selected piece, add the 'valid-move' class.
- **Add Click Handler**: When a square is clicked, call the handleSquareClick function.
- **Append to Board**: Add the square to the board element.

### User Interaction

```javascript
// Handle click on a square
function handleSquareClick(row, col) {
    if (gameOver || currentPlayer === 'black') return;

    const piece = board[row][col];
    
    // If a piece is already selected
    if (selectedPiece) {
        // Check if clicked on a valid move
        const moveIndex = validMoves.findIndex(move => move.row === row && move.col === col);
        
        if (moveIndex !== -1) {
            // Make the move
            const move = validMoves[moveIndex];
            makeMove(selectedPiece.row, selectedPiece.col, move.row, move.col);
            
            // Reset selection
            selectedPiece = null;
            validMoves = [];
            
            // Check if game is over
            if (isCheckmate('black')) {
                gameOver = true;
                statusElement.textContent = 'Checkmate! You win!';
                return;
            }
            
            // AI's turn
            currentPlayer = 'black';
            statusElement.textContent = 'AI is thinking...';
            renderBoard();
            
            // Allow UI to update before AI makes a move
            setTimeout(makeAIMove, 500);
            return;
        }
        
        // Clicked on another square, reset selection
        selectedPiece = null;
        validMoves = [];
    }
    
    // Select a piece if it belongs to the current player
    if (piece && piece[0] === 'w') {
        selectedPiece = { row, col };
        validMoves = getValidMoves(row, col);
    }
    
    renderBoard();
}
```

### Explanation:

- **Game State Check**: If the game is over or it's the AI's turn, ignore the click.
- **Piece Selection Logic**:
  - If a piece is already selected:
    - Check if the clicked square is a valid move.
    - If it is, make the move and let the AI take its turn.
    - If not, reset the selection.
  - If no piece is selected:
    - If the clicked square contains a player's piece, select it and calculate its valid moves.
- **Checkmate Check**: After a move, check if the opponent is in checkmate.
- **AI Turn**: Change the current player to 'black' and trigger the AI to make a move after a short delay.
- **Update Display**: Re-render the board to reflect the new state.

### AI Implementation

```javascript
// Make AI move using minimax algorithm
function makeAIMove() {
    const depth = parseInt(difficultySelect.value);
    const bestMove = findBestMove(depth);
    
    if (bestMove) {
        makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
        
        // Check if game is over
        if (isCheckmate('white')) {
            gameOver = true;
            statusElement.textContent = 'Checkmate! AI wins!';
            renderBoard();
            return;
        }
        
        currentPlayer = 'white';
        statusElement.textContent = 'Your turn (White)';
    } else {
        // No valid moves for AI
        if (isCheck('black')) {
            gameOver = true;
            statusElement.textContent = 'Checkmate! You win!';
        } else {
            gameOver = true;
            statusElement.textContent = 'Stalemate! Game is a draw!';
        }
    }
    
    renderBoard();
}

// Find the best move for AI using minimax algorithm
function findBestMove(depth) {
    let bestScore = -Infinity;
    let bestMove = null;
    
    // For each piece of the AI
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece[0] === 'b') {
                const moves = getValidMoves(row, col);
                
                // For each valid move
                for (const move of moves) {
                    // Make the move temporarily
                    const savedPiece = board[move.row][move.col];
                    board[move.row][move.col] = board[row][col];
                    board[row][col] = '';
                    
                    // Evaluate the move using minimax
                    const score = minimax(depth - 1, false, -Infinity, Infinity);
                    
                    // Undo the move
                    board[row][col] = board[move.row][move.col];
                    board[move.row][move.col] = savedPiece;
                    
                    // Update best move if found
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {
                            fromRow: row,
                            fromCol: col,
                            toRow: move.row,
                            toCol: move.col
                        };
                    }
                }
            }
        }
    }
    
    return bestMove;
}
```

### Explanation:

- **makeAIMove Function**:
  - Get the selected difficulty level (search depth)
  - Find the best move using the minimax algorithm
  - Make the move and check if the player is in checkmate
  - If the AI has no valid moves, determine if it's checkmate or stalemate
  - Update the game state and display

- **findBestMove Function**:
  - Initialize variables to track the best score and move
  - Iterate through all AI pieces and their possible moves
  - For each move:
    - Make the move temporarily
    - Evaluate the position using the minimax algorithm
    - Undo the move
    - If this move is better than the previous best, update the best move
  - Return the best move found

### Minimax Algorithm

```javascript
// Minimax algorithm with alpha-beta pruning
function minimax(depth, isMaximizing, alpha, beta) {
    // Base case: reached maximum depth
    if (depth === 0) {
        return evaluateBoard();
    }
    
    if (isMaximizing) {
        // AI's turn (maximizing)
        let maxScore = -Infinity;
        
        // For each piece of the AI
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece[0] === 'b') {
                    const moves = getValidMoves(row, col);
                    
                    // For each valid move
                    for (const move of moves) {
                        // Make the move temporarily
                        const savedPiece = board[move.row][move.col];
                        board[move.row][move.col] = board[row][col];
                        board[row][col] = '';
                        
                        // Recursively call minimax
                        const score = minimax(depth - 1, false, alpha, beta);
                        
                        // Undo the move
                        board[row][col] = board[move.row][move.col];
                        board[move.row][move.col] = savedPiece;
                        
                        // Update max score
                        maxScore = Math.max(maxScore, score);
                        alpha = Math.max(alpha, score);
                        
                        // Alpha-beta pruning
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
            }
        }
        
        return maxScore;
    } else {
        // Human's turn (minimizing)
        let minScore = Infinity;
        
        // For each piece of the human
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece[0] === 'w') {
                    const moves = getValidMoves(row, col);
                    
                    // For each valid move
                    for (const move of moves) {
                        // Make the move temporarily
                        const savedPiece = board[move.row][move.col];
                        board[move.row][move.col] = board[row][col];
                        board[row][col] = '';
                        
                        // Recursively call minimax
                        const score = minimax(depth - 1, true, alpha, beta);
                        
                        // Undo the move
                        board[row][col] = board[move.row][move.col];
                        board[move.row][move.col] = savedPiece;
                        
                        // Update min score
                        minScore = Math.min(minScore, score);
                        beta = Math.min(beta, score);
                        
                        // Alpha-beta pruning
                        if (beta <= alpha) {
                            break;
                        }
                    }
                }
            }
        }
        
        return minScore;
    }
}
```

### Explanation:

The minimax algorithm is at the heart of the AI's decision-making process. It works like this:

1. **Base Case**: If we've reached the maximum search depth, evaluate the current board position.

2. **Maximizing Player (AI)**:
   - The AI wants to maximize the score.
   - Try all possible moves for all AI pieces.
   - For each move:
     - Make the move temporarily.
     - Recursively call minimax to see what the human would do in response.
     - Undo the move.
     - If the move results in a better score, update the best score.

3. **Minimizing Player (Human)**:
   - The human wants to minimize the score.
   - Try all possible moves for all human pieces.
   - For each move:
     - Make the move temporarily.
     - Recursively call minimax to see what the AI would do in response.
     - Undo the move.
     - If the move results in a worse score, update the worst score.

4. **Recursion**: The algorithm calls itself repeatedly, alternating between maximizing and minimizing players, until it reaches the maximum depth.

### Alpha-Beta Pruning

Alpha-beta pruning is an optimization technique used in the minimax algorithm to reduce the number of positions that need to be evaluated. Here's how it works:

- **Alpha**: The best score the maximizing player (AI) can guarantee so far.
- **Beta**: The best score the minimizing player (human) can guarantee so far.

If at any point `beta <= alpha`, we can stop evaluating more moves because we know the opponent would never allow us to reach this position. This significantly reduces the search space and allows the AI to look deeper without taking too much time.

### Finding the Best Move

The `findBestMove` function uses minimax to evaluate all possible moves and choose the best one:

```javascript
function findBestMove(depth) {
    let bestScore = -Infinity;
    let bestMove = null;
    
    // For each piece of the AI
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece[0] === 'b') {
                const moves = getValidMoves(row, col);
                
                // For each valid move
                for (const move of moves) {
                    // Make the move temporarily
                    const savedPiece = board[move.row][move.col];
                    board[move.row][move.col] = board[row][col];
                    board[row][col] = '';
                    
                    // Evaluate the move using minimax
                    const score = minimax(depth - 1, false, -Infinity, Infinity);
                    
                    // Undo the move
                    board[row][col] = board[move.row][move.col];
                    board[move.row][move.col] = savedPiece;
                    
                    // Update best move if found
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = {
                            fromRow: row,
                            fromCol: col,
                            toRow: move.row,
                            toCol: move.col
                        };
                    }
                }
            }
        }
    }
    
    return bestMove;
}
```

This function:
1. Tries every possible move for the AI
2. Uses minimax to evaluate each move
3. Keeps track of the move with the highest score
4. Returns the best move found

### Board Evaluation

```javascript
// Evaluate the current board state
function evaluateBoard() {
    let score = 0;
    
    // Piece values
    const pieceValues = {
        'p': 10,
        'n': 30,
        'b': 30,
        'r': 50,
        'q': 90,
        'k': 900
    };
    
    // Count material for both sides
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                const value = pieceValues[piece[1]];
                if (piece[0] === 'b') {
                    score += value;
                } else {
                    score -= value;
                }
            }
        }
    }
    
    // Add a small random factor to prevent repetitive moves
    score += (Math.random() - 0.5);
    
    return score;
}
```

### Explanation:

The board evaluation function is crucial for the minimax algorithm. It assigns a numerical value to a board position, indicating how favorable it is for the AI:

1. **Material Count**: The most basic way to evaluate a chess position is to count the value of the pieces each player has.
   - Pawns are worth 10 points
   - Knights and Bishops are worth 30 points
   - Rooks are worth 50 points
   - Queens are worth 90 points
   - Kings are worth 900 points (not technically relevant since kings can't be captured, but useful for evaluation)

2. **Score Calculation**:
   - For each AI (Black) piece, add its value to the score
   - For each human (White) piece, subtract its value from the score
   - This means a positive score indicates an advantage for the AI, while a negative score indicates an advantage for the human

3. **Random Factor**:
   - A small random value between -0.5 and 0.5 is added to the score
   - This prevents the AI from repeating the same moves in similar positions
   - It adds a bit of variety to the AI's play

#### Limitations of the Simple Evaluation

Our evaluation function only considers material (the pieces on the board). Advanced chess engines consider many other factors:

1. **Piece Position**: Some squares are more valuable than others. For example:
   - Controlling the center is generally good
   - Knights are stronger in the center and weaker at the edges
   - Rooks are strong on open files
   - Pawns become more valuable as they advance

2. **King Safety**: Having pieces protecting your king and weakening the opponent's king position.

3. **Mobility**: Having more legal moves available is generally an advantage.

4. **Pawn Structure**: Factors like doubled pawns, isolated pawns, or passed pawns affect the position's strength.

5. **Development**: In the opening, having your pieces developed (moved from their starting positions) is important.

Adding these factors would make the AI much stronger, but also more complex. Our simple material-based evaluation is a good starting point and still creates a challenging opponent.

### Chess Rules Implementation in Detail

```javascript
// Make a move
function makeMove(fromRow, fromCol, toRow, toCol) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = '';
    
    // Check for pawn promotion
    if (board[toRow][toCol] === 'wp' && toRow === 0) {
        board[toRow][toCol] = 'wq'; // Promote to queen
    } else if (board[toRow][toCol] === 'bp' && toRow === 7) {
        board[toRow][toCol] = 'bq'; // Promote to queen
    }
}

// Get valid moves for a piece
function getValidMoves(row, col) {
    const piece = board[row][col];
    if (!piece) return [];
    
    const color = piece[0];
    const type = piece[1];
    const moves = [];
    
    // Get potential moves based on piece type
    switch (type) {
        case 'p':
            getPawnMoves(row, col, color, moves);
            break;
        case 'r':
            getRookMoves(row, col, color, moves);
            break;
        case 'n':
            getKnightMoves(row, col, color, moves);
            break;
        case 'b':
            getBishopMoves(row, col, color, moves);
            break;
        case 'q':
            getQueenMoves(row, col, color, moves);
            break;
        case 'k':
            getKingMoves(row, col, color, moves);
            break;
    }
    
    // Filter out moves that would put or leave the king in check
    return moves.filter(move => {
        // Make the move temporarily
        const savedPiece = board[move.row][move.col];
        board[move.row][move.col] = board[row][col];
        board[row][col] = '';
        
        // Check if the king is in check after the move
        const inCheck = isCheck(color);
        
        // Undo the move
        board[row][col] = board[move.row][move.col];
        board[move.row][move.col] = savedPiece;
        
        return !inCheck;
    });
}
```

### Explanation:

- **makeMove Function**:
  - Move the piece from the source square to the destination square.
  - Handle pawn promotion: if a pawn reaches the opposite end of the board, promote it to a queen.

- **getValidMoves Function**:
  - Get all possible moves for a piece based on its type.
  - Filter out moves that would leave the king in check.
  - This ensures that all moves are legal according to chess rules.

Let's look at how the moves for each piece type are generated:

#### Detailed Explanation of Piece Movement

Let's break down how each piece moves in our chess implementation:

##### 1. Pawn Movement

```javascript
// Get pawn moves
function getPawnMoves(row, col, color, moves) {
    const direction = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    
    // Move forward one square
    if (isInBoard(row + direction, col) && !board[row + direction][col]) {
        moves.push({ row: row + direction, col });
        
        // Move forward two squares from starting position
        if (row === startRow && !board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col });
        }
    }
    
    // Capture diagonally
    for (let i = -1; i <= 1; i += 2) {
        if (isInBoard(row + direction, col + i) && 
            board[row + direction][col + i] && 
            board[row + direction][col + i][0] !== color) {
            moves.push({ row: row + direction, col: col + i });
        }
    }
}
```

**Pawns** have unique movement rules:
- They move forward (up for black, down for white) one square at a time
- From their starting position, they can move two squares forward if both squares are empty
- They can only capture diagonally forward
- In our implementation, we check:
  - If the square directly in front is empty (to move forward)
  - If the pawn is on its starting row and both squares in front are empty (to move two squares)
  - If there are opponent pieces diagonally in front (to capture)
- Missing in this implementation: En passant captures (a special pawn capture rule)

##### 2. Rook Movement

```javascript
// Get rook moves
function getRookMoves(row, col, color, moves) {
    // Directions: up, right, down, left
    const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    
    for (const [dRow, dCol] of directions) {
        let newRow = row + dRow;
        let newCol = col + dCol;
        
        while (isInBoard(newRow, newCol)) {
            if (!board[newRow][newCol]) {
                // Empty square
                moves.push({ row: newRow, col: newCol });
            } else {
                // Square has a piece
                if (board[newRow][newCol][0] !== color) {
                    // Opponent's piece, can capture
                    moves.push({ row: newRow, col: newCol });
                }
                break; // Can't move further in this direction
            }
            
            newRow += dRow;
            newCol += dCol;
        }
    }
}
```

**Rooks** move horizontally or vertically any number of squares:
- We use an array of directions representing up, right, down, and left
- For each direction, we keep moving in that direction until:
  - We hit the edge of the board
  - We hit a piece (we can capture opponent pieces but not move beyond them)
  - We hit our own piece (we can't move there or beyond)
- This implementation correctly handles the "sliding" nature of rook movement

##### 3. Knight Movement

```javascript
// Get knight moves
function getKnightMoves(row, col, color, moves) {
    // All possible knight moves
    const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [dRow, dCol] of knightMoves) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        
        if (isInBoard(newRow, newCol) && 
            (!board[newRow][newCol] || board[newRow][newCol][0] !== color)) {
            moves.push({ row: newRow, col: newCol });
        }
    }
}
```

**Knights** move in an L-shape: two squares in one direction and then one square perpendicular to that direction:
- We store all eight possible L-shaped moves a knight can make
- For each potential move, we check:
  - If the destination is on the board
  - If the destination square is either empty or contains an opponent's piece
- Knights are unique in that they can "jump over" other pieces

##### 4. Bishop Movement

```javascript
// Get bishop moves
function getBishopMoves(row, col, color, moves) {
    // Directions: up-left, up-right, down-right, down-left
    const directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
    
    for (const [dRow, dCol] of directions) {
        let newRow = row + dRow;
        let newCol = col + dCol;
        
        while (isInBoard(newRow, newCol)) {
            if (!board[newRow][newCol]) {
                // Empty square
                moves.push({ row: newRow, col: newCol });
            } else {
                // Square has a piece
                if (board[newRow][newCol][0] !== color) {
                    // Opponent's piece, can capture
                    moves.push({ row: newRow, col: newCol });
                }
                break; // Can't move further in this direction
            }
            
            newRow += dRow;
            newCol += dCol;
        }
    }
}
```

**Bishops** move diagonally any number of squares:
- Similar to rook movement, but in diagonal directions
- We use an array of directions representing up-left, up-right, down-right, and down-left
- The movement rules are the same: move until we hit the edge, an opponent's piece (which we can capture), or our own piece

##### 5. Queen Movement

```javascript
// Get queen moves (combination of rook and bishop)
function getQueenMoves(row, col, color, moves) {
    getRookMoves(row, col, color, moves);
    getBishopMoves(row, col, color, moves);
}
```

**Queens** combine the movement abilities of rooks and bishops:
- Rather than duplicate code, we simply call both the rook and bishop movement functions
- This allows the queen to move horizontally, vertically, and diagonally

##### 6. King Movement

```javascript
// Get king moves
function getKingMoves(row, col, color, moves) {
    // All possible king moves
    for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
            if (dRow === 0 && dCol === 0) continue;
            
            const newRow = row + dRow;
            const newCol = col + dCol;
            
            if (isInBoard(newRow, newCol) && 
                (!board[newRow][newCol] || board[newRow][newCol][0] !== color)) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
}
```

**Kings** move one square in any direction:
- We check all eight surrounding squares
- For each square, we check:
  - If it's on the board
  - If it's either empty or contains an opponent's piece
- Missing in this implementation: Castling (a special king move involving a rook)

#### Legal Move Filtering

After generating all possible moves for a piece, we filter out any moves that would leave the king in check:

```javascript
// Filter out moves that would put or leave the king in check
return moves.filter(move => {
    // Make the move temporarily
    const savedPiece = board[move.row][move.col];
    board[move.row][move.col] = board[row][col];
    board[row][col] = '';
    
    // Check if the king is in check after the move
    const inCheck = isCheck(color);
    
    // Undo the move
    board[row][col] = board[move.row][move.col];
    board[move.row][move.col] = savedPiece;
    
    return !inCheck;
});
```

This is a crucial part of chess rules implementation:
- Even if a move is valid according to the piece's movement rules, it's illegal if it leaves your king in check
- For each potential move:
  1. We make the move temporarily
  2. We check if the king would be in check
  3. We undo the move
  4. If the king would be in check, we filter out that move
- This ensures all moves offered to the player and considered by the AI are legal according to chess rules

## How to Play

1. **Start a Game**: Open the index.html file in a web browser. You play as White, and the AI plays as Black.

2. **Make a Move**: 
   - Click on one of your pieces (white) to select it.
   - Valid moves will be highlighted with a dot.
   - Click on a highlighted square to move your piece there.

3. **AI's Turn**: After you make a move, the AI will automatically calculate and make its move.

4. **Game End**: 
   - The game ends when there's a checkmate or stalemate.
   - The status will display who won or if it's a draw.

5. **Restart**: Click the "Restart Game" button to start a new game.

6. **Difficulty**: Change the AI difficulty by selecting a different search depth:
   - Easy (Depth 1): AI looks only one move ahead.
   - Medium (Depth 2): AI looks two moves ahead.
   - Hard (Depth 3): AI looks three moves ahead.

## Understanding the Minimax Algorithm

The minimax algorithm is what makes the AI "think" about its moves. Here's a simpler explanation:

1. **Looking Ahead**: The AI tries to look several moves ahead to find the best move.

2. **Taking Turns**: The algorithm simulates you making a move, then the AI, then you again, and so on.

3. **Scoring Positions**: Each possible final position is given a score based on which pieces are left.

4. **Best Move Selection**: The AI assumes:
   - You will always make the move that's worst for the AI.
   - The AI will always make the move that's best for itself.

5. **Depth Limitation**: Since there are too many possible positions to check them all, the AI only looks a certain number of moves ahead (the "depth").

### Example:

Imagine the AI is considering moving its knight. It thinks:

- "If I move my knight here, then the human could move their bishop to capture it."
- "But if I move my knight there instead, the human's best move would be to advance a pawn."
- "In the second case, I keep my knight, so that's better for me."

The AI will choose the second move because it leads to a better outcome.

## Possible Improvements

This chess game is intentionally kept simple, but there are many ways it could be improved:

1. **Better Evaluation**: Currently, the AI only considers the material value of pieces. A stronger evaluation would consider:
   - Piece positioning (controlling the center, etc.)
   - Pawn structure
   - King safety
   - Mobility

2. **Deeper Search**: Allowing higher depth values would make the AI stronger, but would require optimizations to keep it fast.

3. **Special Moves**: The current implementation doesn't include:
   - Castling
   - En passant captures
   - Underpromotion (promoting a pawn to something other than a queen)

4. **Draw Conditions**: The game doesn't check for draws due to:
   - Threefold repetition
   - 50-move rule
   - Insufficient material

5. **User Interface Improvements**:
   - Adding move history
   - Highlighting the last move
   - Adding animations

6. **Opening Book**: A pre-programmed set of good opening moves would make the AI play better at the start of the game.

7. **Learning Capability**: The AI could learn from previous games to improve its play over time.

## Advanced Improvements for Chess AI

Our current implementation provides a functional chess game with a basic AI opponent. However, there are many ways to enhance it to make it more sophisticated and challenging. Here's a detailed look at possible improvements:

### 1. Enhanced Board Evaluation

The current evaluation function only considers material value. A more advanced evaluation could include:

#### a) Piece-Square Tables

Assign different values to pieces based on their position on the board. For example:

```javascript
const pawnTable = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];
```

Different tables would be used for each piece type. The evaluation would add or subtract these positional values in addition to the basic material value.

#### b) Pawn Structure Evaluation

Consider factors such as:
- Doubled pawns (two pawns of the same color on the same file): usually a weakness
- Isolated pawns (no friendly pawns on adjacent files): usually a weakness
- Passed pawns (no enemy pawns ahead on the same file or adjacent files): usually an advantage
- Connected pawns (pawns that protect each other): usually an advantage

#### c) King Safety

A king with pawns in front of it and friendly pieces nearby is safer. Factors to consider:
- Pawn shield (pawns in front of the castled king)
- Exposed king (king with open lines to it)
- Piece proximity (number of attacking pieces near the opponent's king)

#### d) Mobility

Count the number of legal moves available to each side. More mobility is generally better.

#### e) Control of Key Squares

Assign higher values to controlling important squares, especially in the center.

#### f) Development in the Opening

Encourage piece development, castling, and control of the center in the early game.

### 2. Search Improvements

#### a) Deeper Search

Increase the maximum search depth to look further ahead. This requires efficient code to avoid slowdowns.

#### b) Iterative Deepening

Start with a shallow search and gradually increase depth until time runs out. This ensures the AI always has a move ready.

```javascript
function findBestMoveIterative(maxTime) {
    let bestMove = null;
    let depth = 1;
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxTime && depth <= 10) {
        const move = findBestMove(depth);
        if (move) bestMove = move;
        depth++;
    }
    
    return bestMove;
}
```

#### c) Quiescence Search

Continue searching beyond the normal depth limit in positions with captures to avoid the "horizon effect" (where a bad exchange happens just beyond the search depth).

```javascript
function quiescenceSearch(alpha, beta) {
    const standPat = evaluateBoard();
    
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;
    
    // Generate only capture moves
    const captureMoves = getAllCaptureMoves();
    
    for (const move of captureMoves) {
        // Make move
        makeMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
        
        const score = -quiescenceSearch(-beta, -alpha);
        
        // Unmake move
        undoMove();
        
        if (score >= beta) return beta;
        if (score > alpha) alpha = score;
    }
    
    return alpha;
}
```

#### d) Move Ordering

Examine promising moves first to maximize alpha-beta pruning efficiency:
- Captures (especially capturing high-value pieces with low-value pieces)
- Threats
- Killer moves (moves that caused cutoffs at the same depth in other branches)
- History heuristic (moves that have been good in the past)

#### e) Transposition Tables

Store previously evaluated positions in a hash table to avoid re-evaluating the same position:

```javascript
const transpositionTable = new Map();

function storePosition(depth, score, flag, bestMove) {
    const key = zobristHash(board); // Generate a unique hash for the position
    transpositionTable.set(key, { depth, score, flag, bestMove });
}

function lookupPosition() {
    const key = zobristHash(board);
    return transpositionTable.get(key);
}
```

### 3. Advanced Chess Features

#### a) Opening Book

Incorporate a database of strong opening moves:

```javascript
const openingBook = {
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w": ["e2e4", "d2d4", "c2c4"], // Starting position
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b": ["e7e5", "c7c5", "e7e6"] // After 1.e4
    // More positions...
};

function getBookMove(fen) {
    const moves = openingBook[fen];
    if (moves && moves.length > 0) {
        return moves[Math.floor(Math.random() * moves.length)];
    }
    return null;
}
```

#### b) Endgame Tablebases

For positions with few pieces (typically 6 or fewer), use pre-computed optimal play:

```javascript
function isTablebasePosition() {
    let pieceCount = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col]) pieceCount++;
        }
    }
    return pieceCount <= 6;
}

function getTablebaseMove() {
    // Look up the optimal move in the tablebase
    // This would require a database of endgame positions
}
```

#### c) Special Moves

Implement missing chess rules:

- **Castling**: A special king move where the king moves two squares and the rook moves to the opposite side of the king
- **En Passant**: A special pawn capture when an opponent's pawn moves two squares forward from its starting position and lands beside your pawn
- **Underpromotion**: Allow promoting a pawn to pieces other than a queen (knight, bishop, or rook)

#### d) Draw Detection

Implement rules for draws:
- Threefold repetition (same position occurs three times)
- 50-move rule (no pawn moves or captures in the last 50 moves)
- Insufficient material (not enough pieces to force checkmate)

### 4. User Interface Improvements

#### a) Move History

Display a list of moves made in the game using standard chess notation:

```javascript
function addMoveToHistory(fromRow, fromCol, toRow, toCol) {
    const piece = board[toRow][toCol];
    const pieceType = getPieceType(piece[1]).toUpperCase();
    const from = String.fromCharCode(97 + fromCol) + (8 - fromRow);
    const to = String.fromCharCode(97 + toCol) + (8 - toRow);
    
    const moveText = pieceType === 'P' ? to : pieceType + from + to;
    historyElement.innerHTML += `<li>${moveText}</li>`;
}
```

#### b) Highlighting

Highlight the last move made, squares under attack, and check situations:

```javascript
function highlightLastMove(fromRow, fromCol, toRow, toCol) {
    // Clear previous highlights
    clearHighlights();
    
    // Add highlight class to source and destination squares
    document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`).classList.add('last-move');
    document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`).classList.add('last-move');
}

function highlightCheck() {
    // Find the king's position
    // Add 'check' class to the king's square
}
```

#### c) Animations

Add smooth animations for piece movements:

```javascript
function animateMove(fromRow, fromCol, toRow, toCol) {
    const fromSquare = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"]`);
    
    const piece = fromSquare.innerHTML;
    const fromRect = fromSquare.getBoundingClientRect();
    const toRect = toSquare.getBoundingClientRect();
    
    const animatedPiece = document.createElement('div');
    animatedPiece.className = 'animated-piece';
    animatedPiece.innerHTML = piece;
    animatedPiece.style.top = fromRect.top + 'px';
    animatedPiece.style.left = fromRect.left + 'px';
    
    document.body.appendChild(animatedPiece);
    
    // Animate from starting position to destination
    animatedPiece.style.transition = 'all 0.3s ease-out';
    animatedPiece.style.top = toRect.top + 'px';
    animatedPiece.style.left = toRect.left + 'px';
    
    // Remove the animated element after animation completes
    setTimeout(() => {
        document.body.removeChild(animatedPiece);
        
        // Update the actual board
        fromSquare.innerHTML = '';
        toSquare.innerHTML = piece;
    }, 300);
}
```

#### d) Responsive Design

Improve the layout to work well on mobile devices and different screen sizes.

### 5. Performance Optimization

#### a) Web Workers

Move the AI calculation to a separate thread to prevent the UI from freezing:

```javascript
// In main script
const aiWorker = new Worker('ai-worker.js');

function makeAIMove() {
    statusElement.textContent = 'AI is thinking...';
    
    // Send current board state to worker
    aiWorker.postMessage({
        board: board,
        depth: parseInt(difficultySelect.value)
    });
}

aiWorker.onmessage = function(e) {
    const bestMove = e.data;
    if (bestMove) {
        makeMove(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
        // Rest of code to handle move...
    }
};

// In ai-worker.js
self.onmessage = function(e) {
    const { board, depth } = e.data;
    // Initialize game state
    // Find best move using minimax
    const bestMove = findBestMove(depth);
    self.postMessage(bestMove);
};
```

#### b) Code Optimization

Optimize critical parts of the code:
- Use more efficient data structures
- Minimize object creation during search
- Avoid unnecessary recalculations

## Conclusion

This detailed guide has explained every aspect of our chess game implementation, from the basic board setup to the advanced AI algorithms. By understanding how each part works, you can now:

1. **Play the Game**: Enjoy a challenging game of chess against the AI.
2. **Understand the Code**: Follow the logic of how pieces move, how the AI makes decisions, and how the game detects important states like check and checkmate.
3. **Modify the Game**: Armed with this knowledge, you can extend the game with new features or improvements.
4. **Learn About AI**: The minimax algorithm used in this chess game is a fundamental concept in artificial intelligence, applicable to many other games and problems.

Whether you're interested in chess, programming, or AI, we hope this guide has provided valuable insights and inspiration for your own projects. The combination of game rules, user interface, and decision-making algorithms in this chess implementation demonstrates how these different components can work together to create an engaging interactive experience.

Remember that the best way to learn is by experimenting. Try making changes to the code, adding new features, or optimizing existing ones. Each improvement you make will deepen your understanding of both chess and programming.

Happy coding and good luck in your games against the AI!

# Screenshoots

![Chess](screenshoots/chess.png)

## Resources:
- https://youtu.be/w4FFX_otR-4