# Taskii

[![Live API](https://img.shields.io/badge/Live-API-brightgreen?style=flat&logo=render)](https://taskii-hwg0.onrender.com)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=flat)

A full-stack to-do app for organizing daily tasks — add, track, and complete your work.

## Live Demo

* App: https://taskii-zk04.onrender.com/
* API: https://taskii-hwg0.onrender.com

## Tech Stack

* Frontend: React 19, Vite, Tailwind CSS v4, shadcn/ui
* Backend: Node.js, Express, MongoDB (Mongoose)
* Deployment: Render (API)

## Project Structure

```text
Taskii/
├── backend/          # Express API (/api/tasks)
│   └── src/
└── frontend/         # React + Vite app
    └── src/
```

## How to Run

### Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
```

API runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set the API URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

App runs at `http://localhost:5173`
