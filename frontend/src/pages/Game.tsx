import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { GameBoard } from '@/components/game/GameBoard';
import { Controls } from '@/components/game/Controls';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useAuth } from '@/contexts/AuthContext';
import { Direction, isOppositeDirection } from '@/utils/gameLogic';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, Home, Heart, Trophy } from 'lucide-react';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const { updateHighScore, user } = useAuth();

  const handleGameOver = useCallback((finalScore: number, finalStage: number) => {
    updateHighScore(finalScore);
    const isHighScore = user && finalScore > user.highScore;
    
    toast.error(
      isHighScore 
        ? `🎉 New High Score: ${finalScore}!` 
        : `Game Over! Score: ${finalScore}`,
      {
        description: isHighScore 
          ? `Reached Stage ${finalStage}! Incredible performance!` 
          : `Reached Stage ${finalStage}. Try again to beat your record!`,
        duration: 5000,
      }
    );
  }, [updateHighScore, user]);

  const {
    snake,
    food,
    direction,
    score,
    lives,
    stage,
    pointsUntilNextStage,
    isPlaying,
    isPaused,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  } = useGameLoop(handleGameOver);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      if (e.key === ' ') {
        e.preventDefault();
        pauseGame();
        return;
      }

      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };

      const newDirection = keyMap[e.key];
      if (newDirection && !isOppositeDirection(direction, newDirection)) {
        changeDirection(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, direction, changeDirection, pauseGame]);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Score */}
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-neon-green" />
                <div>
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-2xl font-bold neon-text text-neon-green">{score}</div>
                </div>
                {user && (
                  <div className="border-l border-primary pl-3 ml-auto">
                    <div className="text-xs text-muted-foreground">Best</div>
                    <div className="text-lg font-bold text-primary">{user.highScore}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lives */}
          <Card className="border-primary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`h-6 w-6 ${
                        i < lives
                          ? 'fill-neon-red text-neon-red'
                          : 'text-muted opacity-30'
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Lives</div>
                  <div className="text-2xl font-bold text-neon-red">{lives}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage */}
          <Card className="border-neon-gold">
            <CardContent className="p-4">
              <div>
                <div className="text-sm text-muted-foreground">Stage</div>
                <div className="text-2xl font-bold neon-text text-neon-gold">Stage {stage}</div>
                {isPlaying && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Next in {pointsUntilNextStage} pts
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <div className="flex flex-col items-center gap-6">
          <GameBoard snake={snake} food={food} />
          
          {/* Game Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isPlaying ? (
              <Button
                onClick={startGame}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-border"
              >
                <Play className="mr-2 h-5 w-5" />
                {score > 0 ? 'Play Again' : 'Start Game'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseGame}
                  size="lg"
                  variant="outline"
                  className="border-primary hover:bg-primary/20"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button
                  onClick={resetGame}
                  size="lg"
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/20"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </>
            )}
            <Button
              onClick={() => navigate('/dashboard')}
              size="lg"
              variant="outline"
              className="border-primary hover:bg-primary/20"
            >
              <Home className="mr-2 h-5 w-5" />
              Menu
            </Button>
          </div>

          {/* Mobile Controls */}
          <Controls
            onDirectionChange={changeDirection}
            disabled={!isPlaying || isPaused}
          />

          {/* Game Status */}
          {isPaused && (
            <Card className="border-primary">
              <CardContent className="p-4 text-center">
                <p className="text-lg font-medium neon-text text-neon-green">PAUSED</p>
                <p className="text-sm text-muted-foreground mt-1">Press Space or tap Resume to continue</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Game;
