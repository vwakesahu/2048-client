"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trophy, Info } from "lucide-react";
import { useGame } from "@/hooks/useGame";
import { getTileColor } from "@/lib/game-utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Game2048() {
  const { board, score, bestScore, gameOver, won, moveCount, initializeGame } =
    useGame();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-6xl font-press-start text-foreground tracking-wider transform -skew-x-6">
              2048
            </h1>
            
          </div>
          <p className="text-muted-foreground font-vt323 text-lg tracking-wider mr-8">
            USE ARROW KEYS TO PLAY
          </p>
        </div>

        {/* Score Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Card className="px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-300">
              <div className="text-black font-vt323 tracking-wider">
                SCORE
              </div>
              <div className="text-2xl font-bungee text-black">
                {score.toLocaleString()}
              </div>
            </Card>
            <Card className="px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-pink-300">
              <div className="text-black font-vt323 tracking-wider">
                BEST
              </div>
              <div className="text-2xl font-bungee text-black">
                {bestScore.toLocaleString()}
              </div>
            </Card>
          </div>
          <Button
            onClick={initializeGame}
            className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-cyan-400 hover:bg-cyan-300 text-black font-vt323 text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all tracking-wider"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            NEW GAME
          </Button>
        </div>

        {/* Game Status */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-none"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-press-start text-xl text-center">
                    HOW TO PLAY
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription className="space-y-4 font-vt323 text-base leading-relaxed">
                  <span className="block">
                    <strong className="text-foreground font-press-start text-sm">USE ARROW KEYS</strong>{" "}
                    to move tiles in that direction.
                  </span>
                  <span className="block">
                    <strong className="text-foreground font-press-start text-sm">
                      TILES WITH SAME NUMBER
                    </strong>{" "}
                    merge when they touch.
                  </span>
                  <span className="block">
                    <strong className="text-foreground font-press-start text-sm">GOAL:</strong> Create a
                    tile with the number 2048 to win!
                  </span>
                  <span className="block">
                    <strong className="text-foreground font-press-start text-sm">TIP:</strong> Keep your
                    highest tile in one corner and build around it.
                  </span>
                </AlertDialogDescription>
              </AlertDialogContent>
            </AlertDialog><div className="text-sm text-muted-foreground font-vt323 tracking-widest">
            MOVES: {moveCount}
          </div></div>
          
          
          {won && (
            <Badge className="bg-lime-400 hover:bg-lime-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-press-start text-xs tracking-wider">
              <Trophy className="w-3 h-3 mr-1" />
              YOU WIN!
            </Badge>
          )}
          {gameOver && (
            <Badge className="bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-press-start text-xs tracking-wider">
              GAME OVER
            </Badge>
          )}
        </div>

        {/* Game Board */}
        <Card className="p-6 bg-white border-4 border-black border-dashed shadow-none">
          <div className="grid grid-cols-4 gap-3">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    aspect-square rounded-none flex items-center justify-center
                    text-lg font-bungee transition-all duration-200 ease-in-out
                    transform
                    ${getTileColor(cell)}
                    ${cell === 0 ? "text-transparent" : ""}
                    ${cell >= 128 ? "text-xl" : ""}
                    ${cell >= 1024 ? "text-base" : ""}
                  `}
                >
                  {cell !== 0 && cell.toLocaleString()}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}