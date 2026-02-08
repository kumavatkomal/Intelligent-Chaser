import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { connectDb } from "./config/db.js";
import { configureGoogleAuth } from "./config/googleAuth.js";
import { initializeGmailTransport } from "./services/gmailService.js";
import tasksRouter from "./routes/tasks.js";
import chasersRouter from "./routes/chasers.js";
import analyticsRouter from "./routes/analytics.js";
import bolticRouter from "./routes/boltic.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import { startScheduler } from "./services/schedulerService.js";

const app = express();
const server = http.createServer(app);

// Normalize CLIENT_ORIGIN (remove trailing slash)
const clientOrigin = (process.env.CLIENT_ORIGIN || "http://localhost:5173").replace(/\/+$/, "");
const allowedOrigins = [clientOrigin, "http://localhost:5173", "http://localhost:5174"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow all during early deployment
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
};

const io = new Server(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100
  })
);

configureGoogleAuth(app);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/chasers", chasersRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/boltic", bolticRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || "Server error" });
});

io.on("connection", (socket) => {
  socket.emit("connected", { id: socket.id });
});

const start = async () => {
  initializeGmailTransport();
  await connectDb(process.env.MONGODB_URI);
  startScheduler();

  const port = process.env.PORT || 5000;
  const maxRetries = 8;
  let attempt = 0;

  const listenWithRetry = () => {
    server.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  };

  server.on("error", (error) => {
    if (error.code !== "EADDRINUSE") {
      throw error;
    }

    attempt += 1;
    if (attempt > maxRetries) {
      console.error(`Port ${port} still in use after ${maxRetries} retries.`);
      process.exit(1);
    }

    const delayMs = 1000 * attempt;
    console.warn(`Port ${port} in use. Retrying in ${delayMs}ms... (${attempt}/${maxRetries})`);
    setTimeout(listenWithRetry, delayMs);
  });

  listenWithRetry();
};

start();
