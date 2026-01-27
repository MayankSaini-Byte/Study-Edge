from backend.database import SessionLocal, engine
from backend.models import User
import sys

def list_users():
    db = SessionLocal()
    users = db.query(User).all()
    print(f"{'ID':<5} {'Name':<20} {'Scholar No':<15} {'Role':<10}")
    print("-" * 50)
    for user in users:
        print(f"{user.id:<5} {user.name:<20} {user.scholar_no:<15} {user.role:<10}")
    db.close()

def set_admin(scholar_no):
    db = SessionLocal()
    user = db.query(User).filter(User.scholar_no == scholar_no).first()
    if user:
        user.role = "admin"
        db.commit()
        print(f"User {user.name} ({scholar_no}) is now an ADMIN.")
    else:
        print(f"User with scholar no {scholar_no} not found.")
    db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python manage_db.py list")
        print("  python manage_db.py make_admin <scholar_no>")
        sys.exit(1)

    command = sys.argv[1]
    
    if command == "list":
        list_users()
    elif command == "make_admin" and len(sys.argv) == 3:
        set_admin(sys.argv[2])
    else:
        print("Invalid command")
