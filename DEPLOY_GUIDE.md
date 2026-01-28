# Deployment Guide

This guide details how to deploy your StudyEdge application to production using **Render** (for Backend) and **Vercel** (for Frontend).

## Prerequisites
- GitHub account
- [Render](https://render.com) account (free tier available)
- [Vercel](https://vercel.com) account (free tier available)
- Code pushed to a GitHub repository

---

## Part 1: Backend Deployment (Render)

1. **Sign in to Render** and go to your Dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `studyedge-backend` (or similar)
   - **Region**: Choose one close to you (e.g., Singapore/Frankfurt/Ohio)
   - **Branch**: `main`
   - **Root Directory**: `.` (leave empty or set to `.`)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn backend.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000`
     *(Note: This assumes your `backend` folder is in the root)*

5. **Environment Variables**:
   Scroll down to "Environment Variables" and add:
   - `PYTHON_VERSION`: `3.10.0` (or your local version)
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app` (You will update this later after deploying frontend)
   - `DATABASE_URL`: *(See Part 3 below if you want PostgreSQL, otherwise it will use ephemeral SQLite)*

6. Click **Create Web Service**.
7. Wait for the deployment to finish. Copy the **Service URL** (e.g., `https://studyedge-backend.onrender.com`).

---

## Part 2: Frontend Deployment (Vercel)

1. **Sign in to Vercel** and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. In "Framework Preset", ensure **Vite** is selected.
4. **Environment Variables**:
   Expand the "Environment Variables" section and add:
   - `VITE_API_URL`: Paste your Render Backend URL from Part 1 (e.g., `https://studyedge-backend.onrender.com`).
     *Important: No trailing slash.*

5. Click **Deploy**.
6. Once deployed, copy your **Frontend Domain** (e.g., `studyedge-frontend.vercel.app`).

---

## Part 3: Final Configuration

1. **Update Backend CORS**:
   - Go back to your Render Dashboard > `studyedge-backend` > **Environment**.
   - Edit `ALLOWED_ORIGINS` and set it to your actual Vercel domain:
     `https://studyedge.vercel.app,http://localhost:5173`
   - Save changes. Render will automatically redeploy.

2. **Database (Optional but Recommended)**:
   - Create a **PostgreSQL** database on Render (New + > PostgreSQL).
   - Copy the `Internal Database URL`.
   - In your Backend Web Service > Environment, add/update `DATABASE_URL` with this value.
   - *Note: Without this, your data (users, assignments) will disappear every time the backend restarts.*

---

## Verification

- Open your Vercel URL.
- Try to Login.
- If it works, you have successfully deployed a production-ready full-stack app!
