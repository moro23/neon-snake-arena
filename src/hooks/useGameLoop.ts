import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Direction, moveSnake, generateFood, GRID_SIZE } from '@/utils/gameLogic';

export const useGameLoop = (
  gameMode: 'classic' | 'portal',
  onGameOver: (score: number) => void
) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(150);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setIsPlaying(true);
  }, [resetGame]);

  const pauseGame = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const changeDirection = useCallback((newDirection: Direction) => {
    setNextDirection(newDirection);
  }, []);

  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      setDirection(nextDirection);
      
      setSnake(currentSnake => {
        const result = moveSnake(
          currentSnake,
          nextDirection,
          gameMode === 'portal',
          food
        );

        if (result.gameOver) {
          setIsPlaying(false);
          onGameOver(score);
          return currentSnake;
        }

        if (result.newFood) {
          setFood(result.newFood);
          setScore(prev => prev + result.scoreIncrease);
        }

        return result.newSnake;
      });
    }, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isPaused, nextDirection, gameMode, food, score, speed, onGameOver]);

  return {
    snake,
    food,
    direction,
    score,
    isPlaying,
    isPaused,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  };
};
