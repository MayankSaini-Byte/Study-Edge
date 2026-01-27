from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
import uuid
from ..database import get_db
from ..models import User, Session as DbSession

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    name: str
    scholar_no: str

@router.post("/login")
def login(login_data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    # Find or create user
    user = db.query(User).filter(User.scholar_no == login_data.scholar_no).first()
    if not user:
        user = User(name=login_data.name, scholar_no=login_data.scholar_no)
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update name if changed
        if user.name != login_data.name:
            user.name = login_data.name
            db.commit()

    # Create session
    token = str(uuid.uuid4())
    expires = datetime.utcnow() + timedelta(days=7)
    db_session = DbSession(token=token, user_id=user.id, expires_at=expires)
    db.add(db_session)
    db.commit()

    # Set HttpOnly Cookie
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        samesite="lax",
        secure=False 
    )

    return {"success": True, "user": {"id": user.id, "name": user.name, "scholar_no": user.scholar_no, "role": user.role}}

@router.post("/logout")
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    session_token = request.cookies.get("session")
    if session_token:
        db.query(DbSession).filter(DbSession.token == session_token).delete()
        db.commit()
    
    response.delete_cookie(key="session")
    return {"success": True}

def get_current_user(request: Request, db: Session = Depends(get_db)):
    session_token = request.cookies.get("session")
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session = db.query(DbSession).filter(
        DbSession.token == session_token,
        DbSession.expires_at > datetime.utcnow()
    ).first()
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return session.user

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user
