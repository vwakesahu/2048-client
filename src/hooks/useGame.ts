import { useState, useEffect, useCallback } from "react";
import { Direction, GameState } from "@/types/game";
import {
  createEmptyBoard,
  addRandomTile,
  moveBoard,
  isGameOver,
} from "@/lib/game-utils";

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    score: 0,
    bestScore: 0,
    gameOver: false,
    won: false,
    moveCount: 0,
  });

  const initializeGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setGameState((prev) => ({
      board: newBoard,
      score: 0,
      bestScore: prev.bestScore,
      gameOver: false,
      won: false,
      moveCount: 0,
    }));
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

      const keyMap: { [key: string]: Direction } = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };

      const direction = keyMap[event.key];
      if (!direction) return;

      event.preventDefault();

      const { newBoard, scoreGained, moved, hasWon } = moveBoard(
        gameState.board,
        direction
      );

      if (moved) {
        const boardWithNewTile = addRandomTile(newBoard);
        const newScore = gameState.score + scoreGained;

        setGameState((prev) => ({
          ...prev,
          board: boardWithNewTile,
          score: newScore,
          won: prev.won || hasWon,
          moveCount: prev.moveCount + 1,
          gameOver: isGameOver(boardWithNewTile),
        }));
      }
    },
    [gameState]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.score > gameState.bestScore) {
      setGameState((prev) => ({ ...prev, bestScore: gameState.score }));
    }
  }, [gameState.score, gameState.bestScore]);

  useEffect(() => {
    initializeGame();
  }, []);

  return {
    ...gameState,
    initializeGame,
  };
}
