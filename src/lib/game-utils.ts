import {
  Board,
  Direction,
  BOARD_SIZE,
  MoveResult,
  WIN_TILE,
} from "@/types/game";

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));
}

export function addRandomTile(currentBoard: Board): Board {
  const emptyCells: [number, number][] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (currentBoard[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length === 0) return currentBoard;

  const newBoard = currentBoard.map((row) => [...row]);
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const [row, col] = emptyCells[randomIndex];
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

  return newBoard;
}

export function moveLine(line: number[]): {
  newLine: number[];
  scoreGained: number;
  hasWon: boolean;
} {
  const filtered = line.filter((cell) => cell !== 0);
  const newLine: number[] = [];
  let scoreGained = 0;
  let hasWon = false;
  let i = 0;

  while (i < filtered.length) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      const mergedValue = filtered[i] * 2;
      newLine.push(mergedValue);
      scoreGained += mergedValue;
      if (mergedValue === WIN_TILE) {
        hasWon = true;
      }
      i += 2;
    } else {
      newLine.push(filtered[i]);
      i += 1;
    }
  }

  while (newLine.length < BOARD_SIZE) {
    newLine.push(0);
  }

  return { newLine, scoreGained, hasWon };
}

export function moveBoard(board: Board, direction: Direction): MoveResult {
  const newBoard: Board = board.map((row) => [...row]);
  let totalScoreGained = 0;
  let moved = false;
  let hasWon = false;

  if (direction === "left") {
    for (let i = 0; i < BOARD_SIZE; i++) {
      const { newLine, scoreGained, hasWon: lineWon } = moveLine(newBoard[i]);
      if (JSON.stringify(newLine) !== JSON.stringify(newBoard[i])) {
        moved = true;
      }
      newBoard[i] = newLine;
      totalScoreGained += scoreGained;
      hasWon = hasWon || lineWon;
    }
  } else if (direction === "right") {
    for (let i = 0; i < BOARD_SIZE; i++) {
      const {
        newLine,
        scoreGained,
        hasWon: lineWon,
      } = moveLine([...newBoard[i]].reverse());
      const finalLine = newLine.reverse();
      if (JSON.stringify(finalLine) !== JSON.stringify(newBoard[i])) {
        moved = true;
      }
      newBoard[i] = finalLine;
      totalScoreGained += scoreGained;
      hasWon = hasWon || lineWon;
    }
  } else if (direction === "up") {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const column = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        column.push(newBoard[i][j]);
      }
      const { newLine, scoreGained, hasWon: lineWon } = moveLine(column);
      if (JSON.stringify(newLine) !== JSON.stringify(column)) {
        moved = true;
      }
      for (let i = 0; i < BOARD_SIZE; i++) {
        newBoard[i][j] = newLine[i];
      }
      totalScoreGained += scoreGained;
      hasWon = hasWon || lineWon;
    }
  } else if (direction === "down") {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const column = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        column.push(newBoard[i][j]);
      }
      const {
        newLine,
        scoreGained,
        hasWon: lineWon,
      } = moveLine([...column].reverse());
      const finalColumn = newLine.reverse();
      if (JSON.stringify(finalColumn) !== JSON.stringify(column)) {
        moved = true;
      }
      for (let i = 0; i < BOARD_SIZE; i++) {
        newBoard[i][j] = finalColumn[i];
      }
      totalScoreGained += scoreGained;
      hasWon = hasWon || lineWon;
    }
  }

  return { newBoard, scoreGained: totalScoreGained, moved, hasWon };
}

export function isGameOver(currentBoard: Board): boolean {
  // Check for empty cells
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (currentBoard[i][j] === 0) return false;
    }
  }

  // Check for possible merges
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const current = currentBoard[i][j];
      if (
        (i < BOARD_SIZE - 1 && currentBoard[i + 1][j] === current) ||
        (j < BOARD_SIZE - 1 && currentBoard[i][j + 1] === current)
      ) {
        return false;
      }
    }
  }

  return true;
}

export function getTileColor(value: number): string {
  const colors: { [key: number]: string } = {
    0: "bg-gray-100 text-gray-400 border-2 border-gray-300",
    2: "bg-yellow-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    4: "bg-pink-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    8: "bg-cyan-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    16: "bg-lime-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    32: "bg-orange-400 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    64: "bg-purple-400 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    128: "bg-red-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    256: "bg-blue-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    512: "bg-green-500 text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    1024: "bg-indigo-600 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    2048: "bg-gradient-to-br from-yellow-400 to-red-500 text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse",
    4096: "bg-gradient-to-br from-purple-500 to-pink-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
    8192: "bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
  };
  return (
    colors[value] ||
    "bg-gradient-to-br from-red-600 to-purple-600 text-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  );
}
