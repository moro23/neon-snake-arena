from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid

# --- Auth Schemas ---

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    avatar: Optional[str] = None
    high_score: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    success: bool
    user: Optional[UserRead] = None
    error: Optional[str] = None
    access_token: Optional[str] = None # Added for backend functionality
    token_type: Optional[str] = "bearer"

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None

# --- Game Schemas ---

class ScoreCreate(BaseModel):
    userId: uuid.UUID
    score: int

class LeaderboardEntry(BaseModel):
    id: uuid.UUID
    username: str
    avatar: Optional[str] = "🐍"
    score: int
    date: datetime

    class Config:
        from_attributes = True

class ActiveGame(BaseModel):
    id: str # Session ID or User ID
    username: str
    avatar: Optional[str] = "🐍"
    score: int
    gameMode: str = "classic"

class SessionUpdate(BaseModel):
    current_stage: int
    current_score: int

class SessionRead(BaseModel):
    user_id: uuid.UUID
    username: Optional[str] = None
    current_stage: int
    current_score: int
    is_active: bool
    last_updated: datetime

    class Config:
        from_attributes = True
