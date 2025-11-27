import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Position, 
  Direction, 
  moveSnake, 
  generateFood, 
  INITIAL_LIVES,
  calculateStage,
  calculateSpeed,
  getPointsUntilNextStage
} from '@/utils/gameLogic';

export const useGameLoop = (
  onGameOver: (score: number, stage: number) => void
) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [stage, setStage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(calculateSpeed(1));

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setLives(INITIAL_LIVES);
    setStage(1);
    setSpeed(calculateSpeed(1));
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const resetSnakePosition = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    setNextDirection('RIGHT');
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
          food
        );

        if (result.lostLife) {
          setLives(currentLives => {
            const newLives = currentLives - 1;
            if (newLives <= 0) {
              setIsPlaying(false);
              onGameOver(score, stage);
            } else {
              // Reset position but keep score and stage
              setTimeout(() => resetSnakePosition(), 0);
            }
            return newLives;
          });
          return currentSnake;
        }

        if (result.newFood) {
          setFood(result.newFood);
          setScore(prev => {
            const newScore = prev + result.scoreIncrease;
            const newStage = calculateStage(newScore);
            if (newStage > stage) {
              setStage(newStage);
              setSpeed(calculateSpeed(newStage));
            }
            return newScore;
          });
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
    lives,
    stage,
    pointsUntilNextStage: getPointsUntilNextStage(score),
    isPlaying,
    isPaused,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  };
};
