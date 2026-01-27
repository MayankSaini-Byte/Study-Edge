# StudyEdge - Mobile Student Productivity App

Complete mobile-first application with Cloudflare Workers backend and React frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm
- Cloudflare account (free tier works)

### 1. Backend Setup (Cloudflare Workers)

#### Install Wrangler (Cloudflare CLI)
```bash
npm install -g wrangler
```

#### Login to Cloudflare
```bash
wrangler login
```

#### Create D1 Database
```bash
wrangler d1 create studyedge-db
```

This will output a `database_id`. **Copy this ID** and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "studyedge-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

#### Run Database Migrations
```bash
wrangler d1 execute studyedge-db --local --file=./migrations/schema.sql
```

#### Start Backend (Development)
```bash
wrangler dev src/worker.ts
```

The backend will run on `http://localhost:8787`

### 2. Frontend Setup

#### Install Dependencies
```bash
npm install
```

#### Start Frontend (Development)
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📱 How to Use

1. **Open the app** in mobile view (Chrome DevTools → Device Toolbar → iPhone 14 Pro)
2. **Login Flow**:
   - Enter your name and mobile number
   - Click "Continue"
   - Check console for OTP (dev mode logs it)
   - Enter the 6-digit OTP
   - Click "Verify OTP"
3. **Dashboard** - View your stats and quick actions
4. **Assignments** - Add and manage assignments
5. **Todos** - Create and complete tasks
6. **Mess Menu** - View today's menu

## 🔐 Authentication

- OTP-based login (no Google)
- Session managed via HTTP-only cookies
- 7-day session expiry
- OTP expires in 5 minutes
- Max 5 OTP verification attempts

## 📊 Database Schema

- `users` - User accounts
- `sessions` - Active sessions
- `otps` - OTP verification codes
- `assignments` - User assignments
- `todos` - User todos
- `mess_menu` - Weekly mess menu

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React Icons

**Backend:**
- Cloudflare Workers
- D1 Database (SQLite)
- Cookie-based sessions

## 🐛 Troubleshooting

### Backend not starting
- Make sure you're logged in to Cloudflare: `wrangler login`
- Verify database ID in `wrangler.toml`
- Run migrations: `wrangler d1 execute studyedge-db --local --file=./migrations/schema.sql`

### Frontend not connecting
- Check backend is running on port 8787
- Verify `src/api/client.ts` has correct `API_BASE_URL`
- Clear browser cookies if session issues occur

### CORS errors
- The worker includes CORS headers
- Try hard refresh (Ctrl+Shift+R)
