// Mock API Client - Simulates backend with realistic latency

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  highScore: number;
}

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  date: string;
}

interface ActiveGame {
  id: string;
  username: string;
  avatar: string;
  score: number;
  gameMode: 'classic' | 'portal';
}

// Mock database
const mockUsers: User[] = [
  {
    id: '1',
    username: 'SnakeMaster',
    email: 'master@snake.game',
    avatar: '🐍',
    highScore: 450,
  },
  {
    id: '2',
    username: 'ArcadeKing',
    email: 'king@arcade.com',
    avatar: '👑',
    highScore: 380,
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'SnakeMaster', avatar: '🐍', score: 450, date: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', username: 'ArcadeKing', avatar: '👑', score: 380, date: new Date(Date.now() - 172800000).toISOString() },
  { id: '3', username: 'PixelPro', avatar: '🎮', score: 350, date: new Date(Date.now() - 259200000).toISOString() },
  { id: '4', username: 'RetroGamer', avatar: '🕹️', score: 320, date: new Date(Date.now() - 345600000).toISOString() },
  { id: '5', username: 'NeonNinja', avatar: '⚡', score: 290, date: new Date(Date.now() - 432000000).toISOString() },
];

const mockActiveGames: ActiveGame[] = [
  { id: 'game1', username: 'LivePlayer1', avatar: '🎯', score: 150, gameMode: 'classic' },
  { id: 'game2', username: 'LivePlayer2', avatar: '🔥', score: 200, gameMode: 'portal' },
  { id: 'game3', username: 'LivePlayer3', avatar: '💎', score: 120, gameMode: 'classic' },
];

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  async login(email: string, password: string) {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Invalid password' };
    }
    
    return { success: true, user };
  },

  async signup(username: string, email: string, password: string) {
    await delay(1000);
    
    if (mockUsers.some(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }
    
    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const avatars = ['🐍', '🎮', '👾', '🕹️', '⚡', '🔥', '💎', '🎯', '👑', '🌟'];
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username,
      email,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      highScore: 0,
    };
    
    mockUsers.push(newUser);
    return { success: true, user: newUser };
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await delay(600);
    return [...mockLeaderboard].sort((a, b) => b.score - a.score);
  },

  async getActiveGames(): Promise<ActiveGame[]> {
    await delay(400);
    return mockActiveGames;
  },

  async updateHighScore(userId: string, score: number) {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (user && score > user.highScore) {
      user.highScore = score;
      
      // Update or add to leaderboard
      const existingEntry = mockLeaderboard.find(e => e.id === userId);
      if (existingEntry) {
        existingEntry.score = score;
        existingEntry.date = new Date().toISOString();
      } else {
        mockLeaderboard.push({
          id: userId,
          username: user.username,
          avatar: user.avatar,
          score,
          date: new Date().toISOString(),
        });
      }
    }
  },
};
