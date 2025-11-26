import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Heart, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold neon-text text-neon-green animate-pulse">
            SNAKE ARENA
          </h1>
          <p className="text-muted-foreground text-lg">
            Portal walls, lives system, and progressive stages
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Single Play Card */}
          <Card className="group hover:border-neon-gold transition-all duration-300 cursor-pointer neon-border border-2"
            onClick={() => navigate('/game')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <span className="text-5xl">🐍</span>
                Start Game
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-lg">
                Portal mode with lives system. Pass through walls, avoid yourself, and progress through stages with increasing difficulty.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-neon-red" />
                  <span className="text-foreground">3 Lives</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-neon-gold" />
                  <span className="text-foreground">Stage Progression</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-neon-green" />
                  <span className="text-foreground">Portal Walls</span>
                </div>
              </div>
              <Button className="w-full bg-neon-gold hover:bg-neon-gold/90 text-background font-bold text-lg py-6" size="lg">
                Play Now
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
            <p>❤️ You have 3 lives - hitting yourself costs 1 life and resets position</p>
            <p>⭐ Progress through stages - every 5 apples increases speed</p>
            <p>🌀 Walls are portals - going through wraps you to the opposite side</p>
            <p>⏸️ Press Space to pause (desktop only)</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
