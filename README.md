# Chess: Player vs AI

A simple chess game where you play against an AI opponent.

## About

This is a simplified chess application focused on providing a clean player vs AI experience.

The game uses these external libraries:

- Chessboard GUI: Using the chessboard.js API
- Game Mechanics: Using the chess.js API

The AI uses the [minimax algorithm](https://en.wikipedia.org/wiki/Minimax) with [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) optimization.

The evaluation function uses [piece square tables](https://www.chessprogramming.org/Piece-Square_Tables) to determine the best moves.

## How to Play

1. Open index.html in your browser to start the game.

2. Play as white by dragging a piece to your desired location. The AI plays as black.

3. Adjust the AI difficulty using the settings dropdown. Higher difficulty will make the AI play better, but it will take longer to make decisions.

4. Use the "New Game" button to reset the game at any time.

5. The game status will be displayed below the board, showing when it's your turn and the outcome of the game.

## License

Use of this project is governed by the [MIT License](LICENSE).
