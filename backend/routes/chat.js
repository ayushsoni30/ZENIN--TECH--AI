const express = require("express");
const router = express.Router();
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const ChatSession = require("../models/ChatSession");

// ─── SYSTEM PROMPT ───
// This defines our bot's personality and domain restriction
const SYSTEM_PROMPT = `You are TechBot — a highly skilled, friendly senior software engineer and technical mentor.

Your domain is strictly TECHNICAL topics. You help with:
- Programming languages (JavaScript, Python, Java, C++, Go, Rust, etc.)
- Web development (React, Node.js, Express, Next.js, Vue, Angular, etc.)
- Backend & APIs (REST, GraphQL, gRPC, WebSockets)
- Databases (MongoDB, PostgreSQL, MySQL, Redis, etc.)
- DevOps & Cloud (Docker, Kubernetes, AWS, GCP, Azure, CI/CD)
- Algorithms & Data Structures
- System Design & Architecture
- Git & Version Control
- Computer Science fundamentals
- Debugging, code review, and best practices
- Open source tools and frameworks

RULES:
1. If a user asks about non-technical topics (politics, cooking, relationships, etc.), politely decline and redirect them to technical questions.
2. Always write clean, well-commented code examples when applicable.
3. Use markdown formatting with proper code blocks and syntax highlighting.
4. Be concise but thorough. Don't over-explain basics unless asked.
5. At the END of every response, add a section titled "**💡 Want to explore more?**" with 2-3 short, relevant follow-up questions the user might find helpful. Format them as a numbered list.
6. Keep a friendly, mentor-like tone — not robotic.`;

// ─── POST /api/chat/message ──────────────────────────────────────────────────
// Send a message and get a response. Creates or continues a session.
router.post("/message", async (req, res) => {
  const { message, sessionId } = req.body;

  // Basic validation
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
    let session;

    // Find existing session or start a new one
    if (sessionId) {
      session = await ChatSession.findOne({ sessionId });
    }

    if (!session) {
      // Brand new conversation
      session = new ChatSession({
        sessionId: uuidv4(),
        messages: [],
      });
    }

    // Add the user's message to history
    session.messages.push({ role: "user", content: message.trim() });

    // Build the messages array for Claude API
    // We send the full history so Claude remembers context
    const apiMessages = session.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Call Anthropic Claude API
    const claudeResponse = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );

    const assistantReply = claudeResponse.data.content[0].text;

    // Save assistant's reply to the session
    session.messages.push({ role: "assistant", content: assistantReply });

    // Save the updated session to MongoDB
    await session.save();

    res.json({
      reply: assistantReply,
      sessionId: session.sessionId,
      title: session.title,
    });
} catch (error) {
  console.log("========== ERROR ==========");
  console.log("Response Data:", error.response?.data);
  console.log("Message:", error.message);

  res.status(500).json({
    error: error.message,
    details: error.response?.data,
  });
}});

// ─── GET /api/chat/sessions ──────────────────────────────────────────────────
// Get all past chat sessions (for the sidebar history)
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await ChatSession.find({ isActive: true })
      .select("sessionId title createdAt updatedAt") // Only return metadata, not full messages
      .sort({ updatedAt: -1 }) // Most recent first
      .limit(50); // Reasonable limit

    res.json(sessions);
  } catch (error) {
    console.error("Sessions fetch error:", error.message);
    res.status(500).json({ error: "Failed to load chat history." });
  }
});

// ─── GET /api/chat/session/:sessionId ────────────────────────────────────────
// Load all messages for a specific session
router.get("/session/:sessionId", async (req, res) => {
  try {
    const session = await ChatSession.findOne({
      sessionId: req.params.sessionId,
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found." });
    }

    res.json(session);
  } catch (error) {
    console.error("Session fetch error:", error.message);
    res.status(500).json({ error: "Failed to load session." });
  }
});

// ─── DELETE /api/chat/session/:sessionId ─────────────────────────────────────
// Delete (soft-delete) a session
router.delete("/session/:sessionId", async (req, res) => {
  try {
    await ChatSession.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { isActive: false }
    );

    res.json({ message: "Session deleted successfully." });
  } catch (error) {
    console.error("Session delete error:", error.message);
    res.status(500).json({ error: "Failed to delete session." });
  }
});

// ─── DELETE /api/chat/sessions/all ───────────────────────────────────────────
// Clear all sessions
router.delete("/sessions/all", async (req, res) => {
  try {
    await ChatSession.updateMany({ isActive: true }, { isActive: false });
    res.json({ message: "All sessions cleared." });
  } catch (error) {
    console.error("Clear all error:", error.message);
    res.status(500).json({ error: "Failed to clear sessions." });
  }
});

module.exports = router;
