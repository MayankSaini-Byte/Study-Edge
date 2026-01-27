from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    scholar_no = Column(String, unique=True, index=True)
    role = Column(String, default="student") # student, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    assignments = relationship("Assignment", back_populates="owner")
    todos = relationship("Todo", back_populates="owner")
    sessions = relationship("Session", back_populates="user")

class Session(Base):
    __tablename__ = "sessions"
    
    token = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    expires_at = Column(DateTime)
    
    user = relationship("User", back_populates="sessions")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(String, default="pending")  # pending, completed
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="assignments")

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="todos")

class MessMenu(Base):
    __tablename__ = "mess_menu"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String, unique=True)
    breakfast = Column(String)
    lunch = Column(String)
    dinner = Column(String)
