from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..database import get_db
from ..models import Assignment, Todo, MessMenu, User
from .auth import get_current_user, get_admin_user

router = APIRouter(tags=["data"])

# Pydantic Models
class AssignmentCreate(BaseModel):
    title: str
    due_date: Optional[datetime] = None

class AssignmentUpdate(BaseModel):
    status: str

class TodoCreate(BaseModel):
    title: str

class TodoUpdate(BaseModel):
    completed: bool

class MessMenuUpdate(BaseModel):
    breakfast: Optional[str] = None
    lunch: Optional[str] = None
    dinner: Optional[str] = None
    tea_time: Optional[str] = None

def no_cache(response: Response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

@router.get("/me", dependencies=[Depends(no_cache)])
def get_me(user: User = Depends(get_current_user)):
    return {"user": {"id": user.id, "name": user.name, "scholar_no": user.scholar_no, "role": user.role}}

# --- Assignments ---
@router.get("/assignments", dependencies=[Depends(no_cache)])
def get_assignments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"assignments": user.assignments}

@router.post("/assignments", status_code=201)
def create_assignment(
    data: AssignmentCreate, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    assignment = Assignment(title=data.title, due_date=data.due_date, user_id=user.id)
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return {"assignment": assignment}

@router.patch("/assignments/{id}")
def update_assignment(
    id: int, 
    data: AssignmentUpdate, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(Assignment.id == id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    assignment.status = data.status
    db.commit()
    db.refresh(assignment)
    return {"assignment": assignment}

@router.delete("/assignments/{id}")
def delete_assignment(
    id: int, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    assignment = db.query(Assignment).filter(Assignment.id == id, Assignment.user_id == user.id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assignment)
    db.commit()
    return {"success": True}

# --- Todos ---
@router.get("/todos", dependencies=[Depends(no_cache)])
def get_todos(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {"todos": user.todos}

@router.post("/todos", status_code=201)
def create_todo(
    data: TodoCreate, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    todo = Todo(title=data.title, user_id=user.id)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return {"todo": todo}

@router.patch("/todos/{id}")
def update_todo(
    id: int, 
    data: TodoUpdate, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    todo = db.query(Todo).filter(Todo.id == id, Todo.user_id == user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.completed = data.completed
    db.commit()
    db.refresh(todo)
    return {"todo": todo}

@router.delete("/todos/{id}")
def delete_todo(
    id: int, 
    user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    todo = db.query(Todo).filter(Todo.id == id, Todo.user_id == user.id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return {"success": True}

# --- Mess Menu ---
@router.get("/mess-menu", dependencies=[Depends(no_cache)])
def get_mess_menu(day: Optional[str] = "today", db: Session = Depends(get_db)):
    target_day = day.lower()
    if target_day == "today":
        target_day = datetime.now().strftime("%A").lower()
        
    menu = db.query(MessMenu).filter(MessMenu.day == target_day).first()
    return {"menu": menu}

# Protected: Only Admin can update mess menu
@router.patch("/mess-menu/{day}")
def update_mess_menu(
    day: str, 
    data: MessMenuUpdate, 
    admin: User = Depends(get_admin_user), # RBAC Enforced
    db: Session = Depends(get_db)
):
    menu = db.query(MessMenu).filter(MessMenu.day == day.lower()).first()
    if not menu:
        raise HTTPException(status_code=404, detail="Menu for this day not found")
    
    if data.breakfast is not None:
        menu.breakfast = data.breakfast
    if data.lunch is not None:
        menu.lunch = data.lunch
    if data.dinner is not None:
        menu.dinner = data.dinner
    # tea_time missing in model, ignoring
    
    db.commit()
    db.refresh(menu)
    return {"menu": menu}
