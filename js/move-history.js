/**
 * Move History Manager for Chess Game
 * Displays and manages the history of moves in the game
 */

const MoveHistoryManager = {
  // Initialize the move history
  init: function () {
    this.moveHistory = [];
    this.currentMoveIndex = -1;
    this.render();
  },

  // Add a new move to the history
  addMove: function (move, fen) {
    const moveNumber = Math.floor(this.moveHistory.length / 2) + 1;
    const isWhiteMove = this.moveHistory.length % 2 === 0;

    // Format the move for display
    let formattedMove = this.formatMove(move);

    // Add the move to the history
    this.moveHistory.push({
      moveNumber: moveNumber,
      color: isWhiteMove ? "white" : "black",
      move: formattedMove,
      fen: fen,
    });

    this.currentMoveIndex = this.moveHistory.length - 1;
    this.render();
  },

  // Format move for display
  formatMove: function (move) {
    if (!move) return "";

    // Handle special moves
    if (move.san) return move.san;

    if (move.flags.includes("k")) return "O-O"; // Kingside castling
    if (move.flags.includes("q")) return "O-O-O"; // Queenside castling

    let result = "";
    if (move.piece !== "p") {
      // Convert piece letter to symbol
      const pieceSymbols = {
        n: "N", // Knight
        b: "B", // Bishop
        r: "R", // Rook
        q: "Q", // Queen
        k: "K", // King
      };
      result += pieceSymbols[move.piece] || move.piece.toUpperCase();
    }

    // Add capture symbol
    if (move.captured) result += "x";

    // Add destination square
    result += move.to;

    // Add promotion piece if applicable
    if (move.promotion) result += "=" + move.promotion.toUpperCase();

    return result;
  },

  // Clear the history
  clear: function () {
    this.moveHistory = [];
    this.currentMoveIndex = -1;
    this.render();
  },

  // Render the move history to the UI
  render: function () {
    const $historyContainer = $("#moveHistory");
    let html = '<div class="move-history-header">Move History</div>';

    if (this.moveHistory.length === 0) {
      html += '<div class="no-moves">No moves yet</div>';
    } else {
      html += '<table class="move-history-table">';

      // Group moves by pairs (white and black)
      for (let i = 0; i < this.moveHistory.length; i += 2) {
        const whiteMove = this.moveHistory[i];
        const blackMove = this.moveHistory[i + 1];

        html += "<tr>";
        html += `<td class="move-number">${Math.floor(i / 2) + 1}.</td>`;
        html += `<td class="white-move">${
          whiteMove ? whiteMove.move : ""
        }</td>`;
        html += `<td class="black-move">${
          blackMove ? blackMove.move : ""
        }</td>`;
        html += "</tr>";
      }

      html += "</table>";
    }

    $historyContainer.html(html);

    // Scroll to the bottom of the container
    $historyContainer.scrollTop($historyContainer[0].scrollHeight);
  },
};
