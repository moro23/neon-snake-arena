# 🐍 Neon Snake Arena

A modern, full-stack multiplayer Snake game with a neon-themed UI, real-time leaderboards, and spectator mode.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## ✨ Features

- 🎮 **Classic Snake Gameplay** with modern controls
- 🔐 **User Authentication** (JWT-based login/signup)
- 🏆 **Global Leaderboard** with high scores
- 👁️ **Spectator Mode** to watch live games
- 🎨 **Neon-themed UI** with smooth animations
- 🐳 **Fully Dockerized** for easy deployment

## 🏗️ Tech Stack

### Frontend
- **React** + **TypeScript** + **Vite**
- **TailwindCSS** for styling
- **Shadcn/UI** components

### Backend
- **FastAPI** (Python)
- **PostgreSQL** database
- **SQLModel** ORM
- **JWT Authentication** with bcrypt

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** for frontend serving
- **Render** deployment ready

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.10+ (for local development)

### Run with Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd neon-snake-arena

# Start all services
docker compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Local Development

#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
neon-snake-arena/
├── backend/              # FastAPI backend
│   ├── main.py          # Application entry point
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── auth.py          # Authentication logic
│   ├── database.py      # Database connection
│   ├── init_db.sql      # Database seed data
│   └── Dockerfile       # Backend container
├── frontend/            # React frontend
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   └── contexts/   # React contexts
│   ├── Dockerfile      # Frontend container
│   └── nginx.conf      # Nginx configuration
├── docker-compose.yml   # Multi-container orchestration
└── render.yaml         # Render deployment config
```

## 🎮 How to Play

1. **Sign Up / Log In** to create your account
2. **Start a Game** from the dashboard
3. Use **Arrow Keys** or **WASD** to control the snake
4. Eat food to grow and increase your score
5. Avoid hitting yourself or the walls
6. Check the **Leaderboard** to see top players
7. Watch others play in **Spectator Mode**

## 🌐 Deployment

### Deploy to Render (Free)

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Create a new **Blueprint** and connect your repository
4. Render will detect `render.yaml` and deploy automatically

The free tier includes:
- Frontend (Web Service)
- Backend (Web Service)
- PostgreSQL Database

## 🔑 Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key

### Frontend
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## 📝 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Game Data
- `POST /scores` - Submit score
- `GET /leaderboard` - Get top scores

### Spectator
- `POST /session/heartbeat` - Update active session
- `GET /games/active` - Get active games

Full API documentation available at `/docs` when running the backend.

## 🧪 Default Test Credentials

The database is seeded with test users (password: `password`):
- `master@snake.game`
- `queen@snake.game`
- `pro@snake.game`
- `joe@snake.game`
- `kai@snake.game`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies and a passion for classic arcade games.

---

**Enjoy the game! 🐍✨**
