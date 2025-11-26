import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockApi } from '@/api/mockClient';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  date: string;
}

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await mockApi.getLeaderboard();
        setEntries(data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-xl font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'border-yellow-400 bg-yellow-400/5';
      case 1:
        return 'border-gray-400 bg-gray-400/5';
      case 2:
        return 'border-amber-600 bg-amber-600/5';
      default:
        return 'border-primary';
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold neon-text text-neon-green">🏆 LEADERBOARD</h1>
          <p className="text-muted-foreground">Top players of Snake Arena</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <Card key={entry.id} className={`${getRankColor(index)} transition-all hover:scale-[1.02]`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(index)}
                      </div>
                      <span className="text-3xl">{entry.avatar}</span>
                      <div>
                        <div className="font-bold text-lg">{entry.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold neon-text text-neon-green">
                        {entry.score}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && entries.length === 0 && (
          <Card className="border-primary">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No scores yet. Be the first to play!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
