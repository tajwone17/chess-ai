/**
 * Chess AI Module
 * Contains all AI-related logic including minimax algorithm and evaluation
 */

class ChessAI {
  constructor() {
    // Piece values and position tables
    this.weights = {
      p: 100,
      n: 280,
      b: 320,
      r: 479,
      q: 929,
      k: 60000,
      k_e: 60000,
    };

    // Piece Square Tables for white pieces
    this.pst_w = {
      p: [
        [100, 100, 100, 100, 105, 100, 100, 100],
        [78, 83, 86, 73, 102, 82, 85, 90],
        [7, 29, 21, 44, 40, 31, 44, 7],
        [-17, 16, -2, 15, 14, 0, 15, -13],
        [-26, 3, 10, 9, 6, 1, 0, -23],
        [-22, 9, 5, -11, -10, -2, 3, -19],
        [-31, 8, -7, -37, -36, -14, 3, -31],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ],
      n: [
        [-66, -53, -75, -75, -10, -55, -58, -70],
        [-3, -6, 100, -36, 4, 62, -4, -14],
        [10, 67, 1, 74, 73, 27, 62, -2],
        [24, 24, 45, 37, 33, 41, 25, 17],
        [-1, 5, 31, 21, 22, 35, 2, 0],
        [-18, 10, 13, 22, 18, 15, 11, -14],
        [-23, -15, 2, 0, 2, 0, -23, -20],
        [-74, -23, -26, -24, -19, -35, -22, -69],
      ],
      b: [
        [-59, -78, -82, -76, -23, -107, -37, -50],
        [-11, 20, 35, -42, -39, 31, 2, -22],
        [-9, 39, -32, 41, 52, -10, 28, -14],
        [25, 17, 20, 34, 26, 25, 15, 10],
        [13, 10, 17, 23, 17, 16, 0, 7],
        [14, 25, 24, 15, 8, 25, 20, 15],
        [19, 20, 11, 6, 7, 6, 20, 16],
        [-7, 2, -15, -12, -14, -15, -10, -10],
      ],
      r: [
        [35, 29, 33, 4, 37, 33, 56, 50],
        [55, 29, 56, 67, 55, 62, 34, 60],
        [19, 35, 28, 33, 45, 27, 25, 15],
        [0, 5, 16, 13, 18, -4, -9, -6],
        [-28, -35, -16, -21, -13, -29, -46, -30],
        [-42, -28, -42, -25, -25, -35, -26, -46],
        [-53, -38, -31, -26, -29, -43, -44, -53],
        [-30, -24, -18, 5, -2, -18, -31, -32],
      ],
      q: [
        [6, 1, -8, -104, 69, 24, 88, 26],
        [14, 32, 60, -10, 20, 76, 57, 24],
        [-2, 43, 32, 60, 72, 63, 43, 2],
        [1, -16, 22, 17, 25, 20, -13, -6],
        [-14, -15, -2, -5, -1, -10, -20, -22],
        [-30, -6, -13, -11, -16, -11, -16, -27],
        [-36, -18, 0, -19, -15, -15, -21, -38],
        [-39, -30, -31, -13, -31, -36, -34, -42],
      ],
      k: [
        [4, 54, 47, -99, -99, 60, 83, -62],
        [-32, 10, 55, 56, 56, 55, 10, 3],
        [-62, 12, -57, 44, -67, 28, 37, -31],
        [-55, 50, 11, -4, -19, 13, 0, -49],
        [-55, -43, -52, -28, -51, -47, -8, -50],
        [-47, -42, -43, -79, -64, -32, -29, -32],
        [-4, 3, -14, -50, -57, -18, 13, 4],
        [17, 30, -3, -14, 6, -1, 40, 18],
      ],
      // Endgame King Table
      k_e: [
        [-50, -40, -30, -20, -20, -30, -40, -50],
        [-30, -20, -10, 0, 0, -10, -20, -30],
        [-30, -10, 20, 30, 30, 20, -10, -30],
        [-30, -10, 30, 40, 40, 30, -10, -30],
        [-30, -10, 30, 40, 40, 30, -10, -30],
        [-30, -10, 20, 30, 30, 20, -10, -30],
        [-30, -30, 0, 0, 0, 0, -30, -30],
        [-50, -30, -30, -30, -30, -30, -30, -50],
      ],
    };

    // Create position tables for black pieces (reversed)
    this.pst_b = {
      p: this.pst_w["p"].slice().reverse(),
      n: this.pst_w["n"].slice().reverse(),
      b: this.pst_w["b"].slice().reverse(),
      r: this.pst_w["r"].slice().reverse(),
      q: this.pst_w["q"].slice().reverse(),
      k: this.pst_w["k"].slice().reverse(),
      k_e: this.pst_w["k_e"].slice().reverse(),
    };

    this.pstOpponent = { w: this.pst_b, b: this.pst_w };
    this.pstSelf = { w: this.pst_w, b: this.pst_b };
    this.positionCount = 0; // Counter for AI calculations
  }

  /**
   * Evaluates the current board position
   * Returns a score from the perspective of the given color
   */
  evaluateBoard(game, move, prevSum, color) {
    // Check for game ending conditions
    if (game.in_checkmate()) {
      if (move.color === color) {
        return 10 ** 10; // We win
      } else {
        return -(10 ** 10); // We lose
      }
    }

    if (
      game.in_draw() ||
      game.in_threefold_repetition() ||
      game.in_stalemate()
    ) {
      return 0; // Draw
    }

    // Bonus for putting opponent in check
    if (game.in_check()) {
      if (move.color === color) {
        prevSum += 50; // We give check
      } else {
        prevSum -= 50; // We are in check
      }
    }

    // Convert chess notation to array indices
    var from = [
      8 - parseInt(move.from[1]),
      move.from.charCodeAt(0) - "a".charCodeAt(0),
    ];
    var to = [
      8 - parseInt(move.to[1]),
      move.to.charCodeAt(0) - "a".charCodeAt(0),
    ];

    // Use endgame king table in endgame
    if (prevSum < -1500) {
      if (move.piece === "k") {
        move.piece = "k_e";
      }
    }

    // Handle captures
    if ("captured" in move) {
      if (move.color === color) {
        // We captured something (good)
        prevSum +=
          this.weights[move.captured] +
          this.pstOpponent[move.color][move.captured][to[0]][to[1]];
      } else {
        // We lost something (bad)
        prevSum -=
          this.weights[move.captured] +
          this.pstSelf[move.color][move.captured][to[0]][to[1]];
      }
    }

    // Handle pawn promotion
    if (move.flags.includes("p")) {
      move.promotion = "q"; // Always promote to queen

      if (move.color === color) {
        // Our promotion (good)
        prevSum -=
          this.weights[move.piece] +
          this.pstSelf[move.color][move.piece][from[0]][from[1]];
        prevSum +=
          this.weights[move.promotion] +
          this.pstSelf[move.color][move.promotion][to[0]][to[1]];
      } else {
        // Opponent promotion (bad)
        prevSum +=
          this.weights[move.piece] +
          this.pstSelf[move.color][move.piece][from[0]][from[1]];
        prevSum -=
          this.weights[move.promotion] +
          this.pstSelf[move.color][move.promotion][to[0]][to[1]];
      }
    } else {
      // Regular move - update position value
      if (move.color !== color) {
        prevSum += this.pstSelf[move.color][move.piece][from[0]][from[1]];
        prevSum -= this.pstSelf[move.color][move.piece][to[0]][to[1]];
      } else {
        prevSum -= this.pstSelf[move.color][move.piece][from[0]][from[1]];
        prevSum += this.pstSelf[move.color][move.piece][to[0]][to[1]];
      }
    }

    return prevSum;
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   * Finds the best move for the given color
   */
  minimax(game, depth, alpha, beta, isMaximizingPlayer, sum, color) {
    this.positionCount++;
    var children = game.ugly_moves({ verbose: true });

    // Randomize moves to avoid always picking the same move on ties
    children.sort(function (a, b) {
      return 0.5 - Math.random();
    });

    // Base case: maximum depth or no moves
    if (depth === 0 || children.length === 0) {
      return [null, sum];
    }

    var maxValue = Number.NEGATIVE_INFINITY;
    var minValue = Number.POSITIVE_INFINITY;
    var bestMove;

    // Try each possible move
    for (var i = 0; i < children.length; i++) {
      var currMove = children[i];
      var currPrettyMove = game.ugly_move(currMove);
      var newSum = this.evaluateBoard(game, currPrettyMove, sum, color);

      // Recursively evaluate this move
      var [childBestMove, childValue] = this.minimax(
        game,
        depth - 1,
        alpha,
        beta,
        !isMaximizingPlayer,
        newSum,
        color
      );

      game.undo(); // Undo the move we just tried

      if (isMaximizingPlayer) {
        if (childValue > maxValue) {
          maxValue = childValue;
          bestMove = currPrettyMove;
        }
        if (childValue > alpha) {
          alpha = childValue;
        }
      } else {
        if (childValue < minValue) {
          minValue = childValue;
          bestMove = currPrettyMove;
        }
        if (childValue < beta) {
          beta = childValue;
        }
      }

      // Alpha-beta pruning
      if (alpha >= beta) {
        break;
      }
    }

    return isMaximizingPlayer ? [bestMove, maxValue] : [bestMove, minValue];
  }

  /**
   * Calculate the best move for the given color
   */
  getBestMove(game, color, currSum) {
    this.positionCount = 0;
    var depth = 3; // Medium difficulty

    var [bestMove, bestMoveValue] = this.minimax(
      game,
      depth,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      true,
      currSum,
      color
    );

    return [bestMove, bestMoveValue];
  }
}

// Export the class for use in other modules
window.ChessAI = ChessAI;
