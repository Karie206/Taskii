# Taskii

A simple task management app built with React and Node.js.

Live: https://taskii-zk04.onrender.com/

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, shadcn/ui, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Deployment: Render

## Local Setup

**Backend**

```bash
cd backend
npm install
```

Create `.env`:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

```bash
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
```

Create `.env`:
```
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
