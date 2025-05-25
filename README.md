# Chess: Player vs AI

A modern, modular chess game where you play against an AI opponent with sound effects and smooth gameplay.

## ✨ Features

- **Clean Player vs AI Experience**: Simplified interface focused on gameplay
- **Sound Effects**: Audio feedback for moves, captures, check, and game events
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
- **`sounds.js`** - Sound effects management with fallback support
- **`main.js`** - Application coordinator and initialization

### External Libraries

- **Chessboard GUI**: [chessboard.js](https://chessboardjs.com/) for the interactive board
- **Game Mechanics**: [chess.js](https://github.com/jhlywa/chess.js/) for move validation and game rules
- **Sound Engine**: [Howler.js](https://howlerjs.com/) with HTML5 Audio fallback
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
3. **Audio Feedback**: Listen for sound cues on moves, captures, and check
4. **Game Controls**:
   - **New Game**: Reset and start fresh
   - **Undo Move**: Take back your last move (and AI's response)
   - **Redo Move**: Restore undone moves
   - **Test Sound**: Verify audio is working

## 🔊 Sound System

The game includes comprehensive audio feedback:

- **Move Sounds**: Different tones for regular moves and captures
- **Check Alert**: Special sound when a king is in check
- **Game Events**: Audio cues for new games and game over
- **Fallback Support**: Works even if primary sound system fails

### Sound Files Location

```
sounds/
├── move.mp3     - Regular piece moves
├── capture.mp3  - Piece captures
├── check.mp3    - Check notifications
├── gameover.mp3 - Game end events
└── newgame.mp3  - New game starts
```

## 🚀 Getting Started

### Quick Start

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately!

### For Development

1. The project uses ES6 modules with clear separation of concerns
2. See `MODULAR_STRUCTURE.md` for detailed architecture documentation
3. All modules are well-documented with JSDoc comments
4. Sound system includes debugging features for troubleshooting

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
│   ├── sounds.js         # Sound system
│   └── chess.js          # Chess.js library
├── sounds/               # Audio files
└── img/chesspieces/     # Chess piece images
```

## 🎯 Game Status Indicators

The game provides clear feedback through:

- **Turn Indicators**: Shows whose turn it is
- **Check Warnings**: Visual and audio alerts for check
- **Game Over Messages**: Clear win/loss/draw notifications
- **AI Thinking**: Visual feedback when AI is calculating
- **Move History**: Undo/redo with move tracking

## 🔧 Troubleshooting

### Sound Issues

- Click "Test Sound" button to verify audio
- Check browser console for audio error messages
- Ensure browser allows audio playback
- Some browsers require user interaction before playing audio

### Performance

- AI thinking time depends on device performance
- Game includes visual feedback during AI calculations
- All interactions remain responsive during AI thinking

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

**Enjoy playing chess! 🎯♟️**
