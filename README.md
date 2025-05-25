# Chess: Player vs AI

A modern, modular chess game where you play against an AI opponent with smooth gameplay.

## ✨ Features

- **Clean Player vs AI Experience**: Simplified interface focused on gameplay
- **Undo/Redo System**: Navigate through your game history
- **Real-time Status Updates**: Clear feedback on game state and turn progression
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Well-organized codebase for easy maintenance and extension

## 🛠️ Technical Architecture

This project uses a modular JavaScript architecture for better code organization:

### Core Modules

- **`game-logic.js`** - Chess game state management and rule validation
- **`chess-ai.js`** - AI intelligence with minimax algorithm and alpha-beta pruning
- **`ui-manager.js`** - User interface interactions and visual feedback
- **`board-interactions.js`** - Chessboard event handling and piece interactions
- **`main.js`** - Application coordinator and initialization

### External Libraries

- **Chessboard GUI**: [chessboard.js](https://chessboardjs.com/) for the interactive board
- **Game Mechanics**: [chess.js](https://github.com/jhlywa/chess.js/) for move validation and game rules
- **UI Framework**: Bootstrap 4 for responsive design
- **Icons**: Font Awesome for button icons

## 🤖 AI Features

The AI uses advanced chess algorithms:

- **Minimax Algorithm** with [alpha-beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning) optimization
- **Piece Square Tables** for positional evaluation
- **Dynamic depth search** for optimal performance
- **Opening book knowledge** for strong early game play

## 🎮 How to Play

1. **Start the Game**: Open `index.html` in your web browser
2. **Make Moves**: Drag and drop pieces as white (you always play white)
3. **Game Controls**:
   - **New Game**: Reset and start fresh
   - **Undo Move**: Take back your last move (and AI's response)
   - **Redo Move**: Restore undone moves

## 🚀 Getting Started

### Quick Start

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately!

### For Development

1. The project uses ES6 modules with clear separation of concerns
2. See `MODULAR_STRUCTURE.md` for detailed architecture documentation
3. All modules are well-documented with JSDoc comments

## 📁 Project Structure

```
chess-ai/
├── index.html              # Main game page
├── README.md              # This file
├── MODULAR_STRUCTURE.md   # Architecture documentation
├── css/
│   └── main.css          # Game styling
├── js/
│   ├── main.js           # Application coordinator
│   ├── game-logic.js     # Chess game logic
│   ├── chess-ai.js       # AI implementation
│   ├── ui-manager.js     # User interface
│   ├── board-interactions.js # Board events
│   └── chess.js          # Chess.js library
└── img/chesspieces/     # Chess piece images
```

## 🎯 Game Status Indicators

The game provides clear feedback through:

- **Turn Indicators**: Shows whose turn it is
- **Check Warnings**: Visual alerts for check
- **Game Over Messages**: Clear win/loss/draw notifications
- **AI Thinking**: Visual feedback when AI is calculating
- **Move History**: Undo/redo with move tracking

## 🔧 Troubleshooting

### Performance

- AI thinking time depends on device performance
- Game includes visual feedback during AI calculations
- All interactions remain responsive during AI thinking

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

**Enjoy playing chess! 🎯♟️**
