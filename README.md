# Intelligent Chaser Agent

> AI-powered deadline management system that automatically chases assignees via email when tasks approach their due dates.

## Features

- **AI-Driven Chaser Messages** — Gemini AI generates personalized follow-up emails
- **Smart Risk Scoring** — Predicts which tasks are likely to miss deadlines
- **Auto Scheduling** — Timed chase windows at 48h, 24h, 4h, and 1h before deadline
- **Google OAuth & Email OTP** — Secure authentication
- **Real-time Dashboard** — Task board, analytics, chaser history, response velocity charts
- **Manual Chase** — Trigger immediate follow-ups on demand

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Node.js, Express, MongoDB Atlas, Socket.IO |
| AI | Google Gemini API |
| Auth | Google OAuth 2.0, JWT, Email OTP |
| Email | Nodemailer (Gmail), Boltic Webhooks |

## Project Structure

```
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics/    # Charts, metrics, leaderboard
│   │   │   ├── Auth/         # Login, Email OTP, Google OAuth
│   │   │   ├── Chasers/      # Manual chase, history, schedule
│   │   │   ├── Common/       # Header, Sidebar, Landing, Loader
│   │   │   ├── Dashboard/    # TaskBoard, RiskScore, Analytics
│   │   │   └── Tasks/        # TaskList, TaskForm, TaskDetail
│   │   ├── contexts/         # Theme, Toast providers
│   │   ├── hooks/            # useTasks, useAnalytics
│   │   ├── services/         # Axios API client
│   │   └── utils/            # Date helpers, formatters
│   └── vercel.json
│
├── backend/           # Express REST API
│   ├── config/        # DB, Google Auth config
│   ├── middleware/     # Auth middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── services/      # AI, Email, Scheduler services
│   ├── utils/         # Utility helpers
│   └── vercel.json
│
└── .gitignore
```

## Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/intelligent-chaser-agent.git
cd intelligent-chaser-agent

# Backend
cd backend
npm install
cp .env.example .env   # Fill in your keys

# Frontend
cd ../frontend
npm install
cp .env.example .env   # Update API URL if needed
```

### 2. Configure Environment

**Backend `.env`** — fill in:
- `MONGODB_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — Any strong random string
- `GEMINI_API_KEY` — From Google AI Studio
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — Gmail with App Password enabled

### 3. Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open `http://localhost:5173`

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Set **Root Directory** to `frontend`
4. Framework Preset: **Vite**
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
   - `VITE_SOCKET_URL` = `https://your-backend-url.onrender.com`
6. Deploy!

### Backend → Render (recommended)

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all environment variables from `.env.example`
7. Update `CLIENT_ORIGIN` to your Vercel frontend URL
8. Update `GOOGLE_CALLBACK_URL` to `https://your-backend.onrender.com/api/auth/google/callback`

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/send-otp` | Send email OTP |
| POST | `/api/auth/verify-otp` | Verify OTP & get JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/chasers/chase/:taskId` | Manual chase |
| GET | `/api/analytics/overview` | Dashboard stats |
| GET | `/api/analytics/risk` | Risk scores |
| GET | `/api/analytics/responses` | Response data |

## License

MIT
