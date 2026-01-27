# Deployment Guide for Vibe Coding App

This guide covers how to deploy the Vibe Coding application (Frontend + Backend).

## ⚠️ Important Note
The current backend uses an **in-memory database**. This means **all data is lost when the server restarts**. For a real production app, you would need to connect a database like MongoDB, PostgreSQL, or SQLite.

---

## 1. Backend Deployment (Node.js)

You can deploy the backend to any Node.js hosting provider (Render, Railway, Heroku, or a VPS). We recommend **Render** for a free start.

### Deploying to Render
1. Push your code to GitHub.
2. Sign up at [dashboard.render.com](https://dashboard.render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Configure the service:
    - **Name**: `vibe-coding-backend`
    - **Root Directory**: `.` (or leave empty)
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node local-backend.mjs`
6. Click **Create Web Service**.
7. Copy the **Service URL** (e.g., `https://vibe-coding-backend.onrender.com`). You will need this for the frontend.

---

## 2. Frontend Deployment (Vite + React)

We recommend **Vercel** for the frontend.

### Deploying to Vercel
1. Sign up at [vercel.com](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the **Configure Project** step:
    - **Framework Preset**: Vite
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
5. **Environment Variables** (Crucial Step):
    - Add a new variable:
        - **Name**: `VITE_API_URL`
        - **Value**: The Backend URL you got from Render (e.g., `https://vibe-coding-backend.onrender.com`) - **NO TRAILING SLASH**
6. Click **Deploy**.

---

## 3. Local Development

To run the project locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Backend**:
   ```bash
   node local-backend.mjs
   ```
   (Runs on `http://localhost:8787`)

3. **Start Frontend**:
   ```bash
   npm run dev
   ```
   (Runs on `http://localhost:5173`)

The frontend will automatically connect to `http://localhost:8787` if `VITE_API_URL` is not set.

## Troubleshooting

- **CORS Errors**: If you see CORS errors in the browser console, ensure your Backend is running and allowed to accept requests from your Frontend domain. (The current `local-backend.mjs` allows `http://localhost:5173`, you might need to update the `Access-Control-Allow-Origin` header in `local-backend.mjs` to `*` or your production domain).
- **Data Disappearing**: As mentioned, the backend is in-memory. This is expected behavior for this demo.
