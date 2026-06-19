const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const chatRoutes = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ──

// Allow requests from our React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Parse JSON request bodies
app.use(express.json({ limit: "10mb" }));

// ─── ROUTES ─────────────

app.use("/api/chat", chatRoutes);

// Health check — useful to confirm the server is alive
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "TechBot server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── DATABASE CONNECTION ──────────────────────────────────────────────────────

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/techbot")
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(` TechBot server running on http://localhost:${PORT}`);
      console.log(` API available at http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });
