const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
    access_token?: string;
}

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const api = {
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (data.success && data.access_token) {
                localStorage.setItem('token', data.access_token);
            }
            return data;
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },

    async signup(username: string, email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (data.success && data.access_token) {
                localStorage.setItem('token', data.access_token);
            }
            return data;
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    },

    async getLeaderboard(): Promise<LeaderboardEntry[]> {
        try {
            const response = await fetch(`${API_URL}/leaderboard`, {
                headers: getHeaders(),
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
            return [];
        }
    },

    async getActiveGames(): Promise<ActiveGame[]> {
        try {
            const response = await fetch(`${API_URL}/games/active`, {
                headers: getHeaders(),
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch active games:', error);
            return [];
        }
    },

    async updateHighScore(userId: string, score: number) {
        try {
            await fetch(`${API_URL}/scores`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ userId, score }),
            });
        } catch (error) {
            console.error('Failed to update high score:', error);
        }
    },

    async sendHeartbeat(current_stage: number, current_score: number) {
        try {
            await fetch(`${API_URL}/session/heartbeat`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ current_stage, current_score })
            });
        } catch (error) {
            console.error('Failed to send heartbeat', error);
        }
    }
};
