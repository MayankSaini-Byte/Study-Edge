-- StudyEdge Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- OTPs table (with attempt tracking)
CREATE TABLE IF NOT EXISTS otps (
  mobile TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INTEGER DEFAULT 0
);

-- Sessions table (for cookie-based authentication)
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Assignments table (with timestamps)
CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Todos table (with timestamps)
CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Mess menu table
CREATE TABLE IF NOT EXISTS mess_menu (
  day TEXT PRIMARY KEY,
  breakfast TEXT,
  lunch TEXT,
  dinner TEXT
);

-- Insert sample mess menu data
INSERT OR IGNORE INTO mess_menu (day, breakfast, lunch, dinner) VALUES
('monday', 'Poha, Tea', 'Dal, Rice, Roti, Sabzi', 'Rajma, Rice, Roti'),
('tuesday', 'Idli, Sambar, Chutney', 'Chole, Rice, Roti', 'Paneer Curry, Roti'),
('wednesday', 'Upma, Tea', 'Dal Fry, Rice, Roti', 'Veg Biryani'),
('thursday', 'Paratha, Curd, Pickle', 'Sambar, Rice, Roti', 'Dal Makhani, Roti'),
('friday', 'Aloo Puri, Tea', 'Kadhi, Rice, Roti', 'Chicken Curry, Rice'),
('saturday', 'Sandwich, Tea', 'Rajma, Rice, Roti', 'Fried Rice, Manchurian'),
('sunday', 'Dosa, Chutney, Sambhar', 'Special Thali', 'Pizza, Pasta');
