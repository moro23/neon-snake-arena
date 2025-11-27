from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from typing import List
from datetime import datetime


from database import init_db, get_session, engine
from models import User, Score, ActiveSession
from schemas import UserCreate, UserRead, Token, ScoreCreate, LoginRequest, AuthResponse, LeaderboardEntry, ActiveGame, SessionUpdate
from auth import get_password_hash, verify_password, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

app = FastAPI(title="Snake Game API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from pathlib import Path
from sqlmodel import text

@app.on_event("startup")
async def on_startup():
    await init_db()
    
    # Check if we need to seed data
    async with engine.begin() as conn:
        # Check if any users exist
        result = await conn.execute(text("SELECT count(*) FROM \"user\""))
        count = result.scalar()
        
        if count == 0:
            print("Seeding database with mock data...")
            file_path = Path(__file__).parent / "init_db.sql"
            if file_path.exists():
                with open(file_path, "r") as f:
                    sql_script = f.read()
                
                # Execute the script
                # asyncpg doesn't support multiple statements in one call, so we split them
                statements = sql_script.split(';')
                for statement in statements:
                    if statement.strip():
                        await conn.execute(text(statement))
                print("Database seeded successfully.")
            else:
                print(f"Warning: {file_path} not found. Skipping seeding.")

# --- Auth Endpoints ---

# --- Auth Endpoints ---

@app.post("/auth/signup", response_model=AuthResponse)
async def signup(user: UserCreate, session: AsyncSession = Depends(get_session)):
    # Check username
    statement = select(User).where(User.username == user.username)
    result = await session.execute(statement)
    if result.scalars().first():
        return AuthResponse(success=False, error="Username already registered")
    
    # Check email
    statement = select(User).where(User.email == user.email)
    result = await session.execute(statement)
    if result.scalars().first():
        return AuthResponse(success=False, error="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    # Assign random avatar
    avatars = ['🐍', '🎮', '👾', '🕹️', '⚡', '🔥', '💎', '🎯', '👑', '🌟']
    import random
    avatar = random.choice(avatars)
    
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password, avatar=avatar)
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    
    # Generate token for immediate login
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return AuthResponse(success=True, user=UserRead.from_orm(db_user), access_token=access_token)

@app.post("/auth/login", response_model=AuthResponse)
async def login(login_data: LoginRequest, session: AsyncSession = Depends(get_session)):
    statement = select(User).where(User.email == login_data.email)
    result = await session.execute(statement)
    user = result.scalars().first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        return AuthResponse(success=False, error="Invalid email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return AuthResponse(success=True, user=UserRead.from_orm(user), access_token=access_token)

# --- Game Data Endpoints ---

@app.post("/scores")
async def submit_score(score_data: ScoreCreate, session: AsyncSession = Depends(get_session)):
    # Note: Client spec sends userId in body, implying no auth header? 
    # But we should probably verify the user exists. 
    # Ideally we use current_user, but let's follow spec for the endpoint signature 
    # and maybe verify if the ID matches current_user if we enforced auth.
    # For now, we trust the ID or just look it up.
    
    statement = select(User).where(User.id == score_data.userId)
    result = await session.execute(statement)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update high score if needed
    if score_data.score > user.high_score:
        user.high_score = score_data.score
        session.add(user)
    
    # Record the score history
    db_score = Score(user_id=user.id, score=score_data.score, max_stage_reached=0) # Spec doesn't send stage?
    session.add(db_score)
    
    await session.commit()
    return {"status": "ok"}

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(session: AsyncSession = Depends(get_session)):
    # Get top 10 users by high_score
    statement = select(User).order_by(User.high_score.desc()).limit(10)
    result = await session.execute(statement)
    users = result.scalars().all()
    
    leaderboard = []
    for user in users:
        leaderboard.append(LeaderboardEntry(
            id=user.id,
            username=user.username,
            avatar=user.avatar,
            score=user.high_score,
            date=datetime.utcnow() # User model doesn't track high score date, using now or created_at
        ))
    return leaderboard

# --- Spectator Endpoints ---

@app.get("/games/active", response_model=List[ActiveGame])
async def get_active_games(session: AsyncSession = Depends(get_session)):
    # Filter for sessions updated in the last 10 seconds
    cutoff_time = datetime.utcnow() - timedelta(seconds=10)
    statement = select(ActiveSession, User).join(User).where(ActiveSession.last_updated >= cutoff_time)
    result = await session.execute(statement)
    
    active_games = []
    for active_session, user in result:
        active_games.append(ActiveGame(
            id=str(user.id),
            username=user.username,
            avatar=user.avatar,
            score=active_session.current_score,
            gameMode="classic" # Default for now
        ))
        
    return active_games

@app.post("/session/heartbeat")
async def heartbeat(session_update: SessionUpdate, current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    statement = select(ActiveSession).where(ActiveSession.user_id == current_user.id)
    result = await session.execute(statement)
    active_session = result.scalars().first()
    
    if active_session:
        active_session.current_stage = session_update.current_stage
        active_session.current_score = session_update.current_score
        active_session.last_updated = datetime.utcnow()
        active_session.is_active = True
    else:
        active_session = ActiveSession(
            user_id=current_user.id,
            current_stage=session_update.current_stage,
            current_score=session_update.current_score,
            is_active=True
        )
        session.add(active_session)
    
    await session.commit()
    return {"status": "ok"}
