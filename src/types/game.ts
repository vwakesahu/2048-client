export type Board = number[][];
export type Direction = "up" | "down" | "left" | "right";

export const BOARD_SIZE = 4;
export const WIN_TILE = 2048;

export interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  moveCount: number;
}

export interface MoveResult {
  newBoard: Board;
  scoreGained: number;
  moved: boolean;
  hasWon: boolean;
}
