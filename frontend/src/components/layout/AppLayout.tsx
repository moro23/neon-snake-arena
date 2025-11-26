import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { NavLink } from '@/components/NavLink';
import { Gamepad2, Trophy, Eye, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-primary bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold neon-text text-neon-green">🐍 SNAKE ARENA</h1>
            
            <nav className="hidden md:flex gap-4">
              <NavLink
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-primary/20"
                activeClassName="bg-primary/30 text-neon-green"
              >
                <Gamepad2 className="w-4 h-4" />
                Play
              </NavLink>
              <NavLink
                to="/leaderboard"
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-primary/20"
                activeClassName="bg-primary/30 text-neon-green"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </NavLink>
              <NavLink
                to="/spectator"
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-primary/20"
                activeClassName="bg-primary/30 text-neon-green"
              >
                <Eye className="w-4 h-4" />
                Watch
              </NavLink>
            </nav>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-secondary rounded-md">
                <span className="text-2xl">{user.avatar}</span>
                <div className="text-sm">
                  <div className="font-medium">{user.username}</div>
                  <div className="text-muted-foreground">Best: {user.highScore}</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="border-destructive text-destructive hover:bg-destructive/20"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex border-b border-primary bg-card">
        <NavLink
          to="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 py-3 transition-colors hover:bg-primary/20"
          activeClassName="bg-primary/30 text-neon-green"
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-sm">Play</span>
        </NavLink>
        <NavLink
          to="/leaderboard"
          className="flex-1 flex items-center justify-center gap-2 py-3 transition-colors hover:bg-primary/20"
          activeClassName="bg-primary/30 text-neon-green"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-sm">Ranks</span>
        </NavLink>
        <NavLink
          to="/spectator"
          className="flex-1 flex items-center justify-center gap-2 py-3 transition-colors hover:bg-primary/20"
          activeClassName="bg-primary/30 text-neon-green"
        >
          <Eye className="w-5 h-5" />
          <span className="text-sm">Watch</span>
        </NavLink>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};
