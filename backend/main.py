from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from .models import MessMenu
from .routers import auth, data

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

import os

# CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(data.router)

@app.on_event("startup")
def populate_mess_menu():
    db = SessionLocal()
    if db.query(MessMenu).count() == 0:
        menu_items = [
            { "day": 'monday', "breakfast": 'Poha, Tea', "lunch": 'Dal, Rice, Roti, Sabzi', "dinner": 'Rajma, Rice, Roti' },
            { "day": 'tuesday', "breakfast": 'Idli, Sambar, Chutney', "lunch": 'Chole, Rice, Roti', "dinner": 'Paneer Curry, Roti' },
            { "day": 'wednesday', "breakfast": 'Upma, Tea', "lunch": 'Dal Fry, Rice, Roti', "dinner": 'Veg Biryani' },
            { "day": 'thursday', "breakfast": 'Paratha, Curd, Pickle', "lunch": 'Sambar, Rice, Roti', "dinner": 'Dal Makhani, Roti' },
            { "day": 'friday', "breakfast": 'Aloo Puri, Tea', "lunch": 'Kadhi, Rice, Roti', "dinner": 'Chicken Curry, Rice' },
            { "day": 'saturday', "breakfast": 'Sandwich, Tea', "lunch": 'Rajma, Rice, Roti', "dinner": 'Fried Rice, Manchurian' },
            { "day": 'sunday', "breakfast": 'Dosa, Chutney, Sambhar', "lunch": 'Special Thali', "dinner": 'Pizza, Pasta' }
        ]
        for item in menu_items:
            db.add(MessMenu(**item))
        db.commit()
    db.close()

@app.get("/")
def root():
    return {"message": "StudyEdge API is running"}
