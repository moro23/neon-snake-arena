import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { GameBoard } from '@/components/game/GameBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockApi } from '@/api/mockClient';
import { Position, Direction, generateFood, moveSnake, getAIDirection } from '@/utils/gameLogic';
import { Loader2, Play, Pause } from 'lucide-react';

interface ActiveGame {
  id: string;
  username: string;
  avatar: string;
  score: number;
  gameMode: 'classic' | 'portal';
}

const Spectator: React.FC = () => {
  const [activeGames, setActiveGames] = useState<ActiveGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<ActiveGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatching, setIsWatching] = useState(false);
  
  // AI Bot state
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchActiveGames = async () => {
      try {
        const games = await mockApi.getActiveGames();
        setActiveGames(games);
      } catch (error) {
        console.error('Failed to fetch active games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveGames();
  }, []);

  useEffect(() => {
    if (!isWatching || !selectedGame) return;

    const interval = setInterval(() => {
      setSnake(currentSnake => {
        // AI determines next direction
        const newDirection = getAIDirection(currentSnake, food, direction);
        setDirection(newDirection);

        const result = moveSnake(
          currentSnake,
          newDirection,
          selectedGame.gameMode === 'portal',
          food
        );

        if (result.gameOver) {
          // Reset the game
          const initialSnake = [{ x: 10, y: 10 }];
          setFood(generateFood(initialSnake));
          setScore(0);
          setDirection('RIGHT');
          return initialSnake;
        }

        if (result.newFood) {
          setFood(result.newFood);
          setScore(prev => prev + result.scoreIncrease);
        }

        return result.newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isWatching, selectedGame, food, direction]);

  const handleWatchGame = (game: ActiveGame) => {
    setSelectedGame(game);
    setIsWatching(true);
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setScore(0);
    setDirection('RIGHT');
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold neon-text text-neon-green">👁️ SPECTATOR MODE</h1>
          <p className="text-muted-foreground">Watch live games in action</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !selectedGame ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeGames.map((game) => (
              <Card key={game.id} className="border-primary hover:border-neon-green transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{game.avatar}</span>
                    <div>
                      <CardTitle className="text-lg">{game.username}</CardTitle>
                      <div className="text-sm text-muted-foreground capitalize">{game.gameMode} Mode</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Score</span>
                      <span className="text-2xl font-bold text-neon-green">{game.score}</span>
                    </div>
                    <Button
                      onClick={() => handleWatchGame(game)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Watch Game
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Game Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Card className="w-full sm:w-auto border-primary">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedGame.avatar}</span>
                    <div>
                      <div className="font-bold text-lg">{selectedGame.username}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {selectedGame.gameMode} Mode
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full sm:w-auto border-primary">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Live Score</div>
                      <div className="text-3xl font-bold neon-text text-neon-green">{score}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsWatching(!isWatching)}
                        variant="outline"
                        size="icon"
                        className="border-primary"
                      >
                        {isWatching ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedGame(null);
                          setIsWatching(false);
                        }}
                        variant="outline"
                        className="border-primary"
                      >
                        Back to List
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Game Board */}
            <div className="flex justify-center">
              <GameBoard snake={snake} food={food} />
            </div>

            <Card className="border-primary">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  🤖 Watching AI bot play {selectedGame.gameMode} mode
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!isLoading && activeGames.length === 0 && !selectedGame && (
          <Card className="border-primary">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No active games at the moment. Check back later!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Spectator;
