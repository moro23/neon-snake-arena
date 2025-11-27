from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    username: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    avatar: Optional[str] = Field(default="🐍")
    high_score: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Score(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    score: int
    max_stage_reached: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ActiveSession(SQLModel, table=True):
    user_id: uuid.UUID = Field(foreign_key="user.id", primary_key=True)
    current_stage: int
    current_score: int
    is_active: bool = Field(default=True)
    last_updated: datetime = Field(default_factory=datetime.utcnow)
