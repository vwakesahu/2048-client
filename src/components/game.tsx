"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trophy, Gamepad2 } from "lucide-react";

type Board = number[][];
type Direction = "up" | "down" | "left" | "right";

const BOARD_SIZE = 4;
const WIN_TILE = 2048;

export default function Game2048() {
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  // Initialize empty board
  function createEmptyBoard(): Board {
    return Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0));
  }

  // Add random tile (2 or 4) to empty position
  const addRandomTile = useCallback((currentBoard: Board): Board => {
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
  }, []);

  // Initialize game with two random tiles
  const initializeGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setMoveCount(0);
  }, [addRandomTile]);

  // Move and merge tiles in a line
  const moveLine = (
    line: number[]
  ): { newLine: number[]; scoreGained: number } => {
    const filtered = line.filter((cell) => cell !== 0);
    const newLine: number[] = [];
    let scoreGained = 0;
    let i = 0;

    while (i < filtered.length) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;
        newLine.push(mergedValue);
        scoreGained += mergedValue;

        if (mergedValue === WIN_TILE && !won) {
          setWon(true);
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

    return { newLine, scoreGained };
  };

  // Move board in specified direction
  const moveBoard = useCallback(
    (
      direction: Direction
    ): { newBoard: Board; scoreGained: number; moved: boolean } => {
      let newBoard: Board = board.map((row) => [...row]);
      let totalScoreGained = 0;
      let moved = false;

      if (direction === "left") {
        for (let i = 0; i < BOARD_SIZE; i++) {
          const { newLine, scoreGained } = moveLine(newBoard[i]);
          if (JSON.stringify(newLine) !== JSON.stringify(newBoard[i])) {
            moved = true;
          }
          newBoard[i] = newLine;
          totalScoreGained += scoreGained;
        }
      } else if (direction === "right") {
        for (let i = 0; i < BOARD_SIZE; i++) {
          const { newLine, scoreGained } = moveLine([...newBoard[i]].reverse());
          const finalLine = newLine.reverse();
          if (JSON.stringify(finalLine) !== JSON.stringify(newBoard[i])) {
            moved = true;
          }
          newBoard[i] = finalLine;
          totalScoreGained += scoreGained;
        }
      } else if (direction === "up") {
        for (let j = 0; j < BOARD_SIZE; j++) {
          const column = [];
          for (let i = 0; i < BOARD_SIZE; i++) {
            column.push(newBoard[i][j]);
          }
          const { newLine, scoreGained } = moveLine(column);
          if (JSON.stringify(newLine) !== JSON.stringify(column)) {
            moved = true;
          }
          for (let i = 0; i < BOARD_SIZE; i++) {
            newBoard[i][j] = newLine[i];
          }
          totalScoreGained += scoreGained;
        }
      } else if (direction === "down") {
        for (let j = 0; j < BOARD_SIZE; j++) {
          const column = [];
          for (let i = 0; i < BOARD_SIZE; i++) {
            column.push(newBoard[i][j]);
          }
          const { newLine, scoreGained } = moveLine([...column].reverse());
          const finalColumn = newLine.reverse();
          if (JSON.stringify(finalColumn) !== JSON.stringify(column)) {
            moved = true;
          }
          for (let i = 0; i < BOARD_SIZE; i++) {
            newBoard[i][j] = finalColumn[i];
          }
          totalScoreGained += scoreGained;
        }
      }

      return { newBoard, scoreGained: totalScoreGained, moved };
    },
    [board, won]
  );

  // Check if game is over
  const isGameOver = useCallback((currentBoard: Board): boolean => {
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
  }, []);

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameOver) return;

      const keyMap: { [key: string]: Direction } = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };

      const direction = keyMap[event.key];
      if (!direction) return;

      event.preventDefault();

      const { newBoard, scoreGained, moved } = moveBoard(direction);

      if (moved) {
        const boardWithNewTile = addRandomTile(newBoard);
        setBoard(boardWithNewTile);
        setScore((prev) => prev + scoreGained);
        setMoveCount((prev) => prev + 1);

        if (isGameOver(boardWithNewTile)) {
          setGameOver(true);
        }
      }
    },
    [gameOver, moveBoard, addRandomTile, isGameOver]
  );

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Update best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Get tile color based on value using brutalism colors
  const getTileColor = (value: number): string => {
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
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-6xl font-bungee text-foreground mb-2 tracking-wider transform -skew-x-6">
            2048
          </h1>
          <p className="text-muted-foreground font-press-start text-xs tracking-widest">
            USE ARROW KEYS TO PLAY
          </p>
        </div>

        {/* Score Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Card className="px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-300">
              <div className="text-xs text-black font-press-start tracking-wider">
                SCORE
              </div>
              <div className="text-xl font-bungee text-black">
                {score.toLocaleString()}
              </div>
            </Card>
            <Card className="px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-pink-300">
              <div className="text-xs text-black font-press-start tracking-wider">
                BEST
              </div>
              <div className="text-xl font-bungee text-black">
                {bestScore.toLocaleString()}
              </div>
            </Card>
          </div>
          <Button
            onClick={initializeGame}
            variant="outline"
            size="sm"
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-cyan-400 hover:bg-cyan-300 text-black font-press-start text-xs hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all tracking-wider"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            NEW GAME
          </Button>
        </div>

        {/* Game Status */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-muted-foreground font-press-start tracking-widest">
            MOVES: {moveCount}
          </div>
          {won && (
            <Badge
              variant="default"
              className="bg-lime-400 hover:bg-lime-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-press-start text-xs tracking-wider"
            >
              <Trophy className="w-3 h-3 mr-1" />
              YOU WIN!
            </Badge>
          )}
          {gameOver && (
            <Badge
              variant="destructive"
              className="bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-press-start text-xs tracking-wider"
            >
              GAME OVER
            </Badge>
          )}
        </div>

        {/* Game Board */}
        <Card className="p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid grid-cols-4 gap-3">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    aspect-square rounded-none flex items-center justify-center
                    text-lg font-bungee transition-all duration-200 ease-in-out
                    transform hover:scale-105 active:scale-95
                    ${getTileColor(cell)}
                    ${cell === 0 ? "text-transparent" : ""}
                    ${cell >= 128 ? "text-xl" : ""}
                    ${cell >= 1024 ? "text-base font-bungee" : ""}
                  `}
                >
                  {cell !== 0 && cell.toLocaleString()}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-vt323 tracking-wider">
              <Gamepad2 className="w-5 h-5 mr-2" />
              HOW TO PLAY
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2 font-vt323">
            <p>
              <strong className="text-foreground font-press-start text-xs">
                USE ARROW KEYS
              </strong>{" "}
              to move tiles in that direction.
            </p>
            <p>
              <strong className="text-foreground font-press-start text-xs">
                TILES WITH SAME NUMBER
              </strong>{" "}
              merge when they touch.
            </p>
            <p>
              <strong className="text-foreground font-press-start text-xs">
                GOAL:
              </strong>{" "}
              Create a tile with the number 2048 to win!
            </p>
            <p>
              <strong className="text-foreground font-press-start text-xs">
                TIP:
              </strong>{" "}
              Keep your highest tile in one corner and build around it.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
