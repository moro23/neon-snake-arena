import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold neon-text text-neon-green animate-pulse">
            SELECT YOUR MODE
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose your challenge and dominate the leaderboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Classic Mode */}
          <Card className="border-neon-red hover:border-neon-red/50 transition-all cursor-pointer group neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Shield className="w-12 h-12 text-neon-red" />
                <span className="text-4xl">🏛️</span>
              </div>
              <CardTitle className="text-2xl text-neon-red">Classic Mode</CardTitle>
              <CardDescription>Traditional snake gameplay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Hit the wall = Game Over</li>
                <li>✓ Test your precision</li>
                <li>✓ Master the classic challenge</li>
              </ul>
              <Button
                onClick={() => navigate('/game/classic')}
                className="w-full bg-neon-red/20 border-2 border-neon-red text-neon-red hover:bg-neon-red hover:text-background transition-all"
                size="lg"
              >
                Play Classic
              </Button>
            </CardContent>
          </Card>

          {/* Portal Mode */}
          <Card className="border-neon-blue hover:border-neon-blue/50 transition-all cursor-pointer group neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Zap className="w-12 h-12 text-neon-blue" />
                <span className="text-4xl">🌀</span>
              </div>
              <CardTitle className="text-2xl text-neon-blue">Portal Mode</CardTitle>
              <CardDescription>Pass through walls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Walls teleport you to opposite side</li>
                <li>✓ Infinite playground</li>
                <li>✓ Pure survival challenge</li>
              </ul>
              <Button
                onClick={() => navigate('/game/portal')}
                className="w-full bg-neon-blue/20 border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-background transition-all"
                size="lg"
              >
                Play Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>🎮 <strong>Desktop:</strong> Use arrow keys to control your snake</p>
            <p>📱 <strong>Mobile:</strong> Tap the directional buttons</p>
            <p>🎯 Eat the red food to grow and score points</p>
            <p>⚠️ Don't crash into yourself!</p>
            <p>⏸️ Press Space to pause (desktop only)</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
