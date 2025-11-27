# Multiplayer Snake Game Backend

This is the backend service for the Multiplayer Snake Game, built with FastAPI, PostgreSQL, and Docker.

## Tech Stack

- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **ORM**: SQLModel (SQLAlchemy Async)
- **Authentication**: OAuth2 with JWT (python-jose, passlib)
- **Containerization**: Docker & Docker Compose

## Project Structure

- `main.py`: Application entry point and API endpoints.
- `models.py`: Database models (User, Score, ActiveSession).
- `schemas.py`: Pydantic models for request/response validation.
- `database.py`: Database connection and session management.
- `auth.py`: Authentication logic (hashing, token generation).
- `Dockerfile`: Docker build instructions.
- `requirements.txt`: Python dependencies.

## Setup & Running

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1.  Navigate to the project root (where `docker-compose.yml` is located).
2.  Run the services:

    ```bash
    docker-compose up --build
    ```

    Or if you are using Docker Compose V2:

    ```bash
    docker compose up --build
    ```

3.  The backend API will be available at `http://localhost:8000`.

### Running Locally (Python & pip)

If you prefer to run the backend locally without Docker (e.g., for development), follow these steps:

1.  **Prerequisites**: Ensure you have Python 3.10+ installed.

2.  **Create a Virtual Environment**:
    Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
    Create the virtual environment:
    ```bash
    python3 -m venv .venv
    ```

3.  **Activate the Virtual Environment**:
    - On Linux/macOS:
      ```bash
      source venv/bin/activate
      ```
    - On Windows:
      ```bash
      .\venv\Scripts\activate
      ```

4.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

5.  **Set Environment Variables**:
    You need a running PostgreSQL instance. If you are using the Docker DB, you can expose it or run a local Postgres server.
    
    Export the `DATABASE_URL` (example for local default Postgres):
    ```bash
    export DATABASE_URL="postgresql+asyncpg://user:password@localhost/snake_db"
    ```
    *(Note: If using the docker-compose DB from the host, you might need to map the port 5432 in docker-compose.yml and use `localhost`)*

6.  **Run the Server**:
    ```bash
    uvicorn main:app --reload
    ```

## API Documentation

FastAPI automatically generates interactive API documentation. Once the server is running, you can access it at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Environment Variables

- `DATABASE_URL`: Connection string for PostgreSQL (default set in `docker-compose.yml` and `database.py`).
- `SECRET_KEY`: Secret key for JWT encoding (default set in `auth.py`). **Change this for production!**

## Key Features

- **User Authentication**: Signup and Login with JWT.
- **Score Tracking**: Submit scores and view the top 10 leaderboard.
- **Spectator Mode Support**:
    - `POST /session/heartbeat`: Update player status (stage, score).
    - `GET /session/active`: List currently active players for the spectator view.
