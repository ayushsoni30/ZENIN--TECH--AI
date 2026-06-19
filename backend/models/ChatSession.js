const mongoose = require("mongoose");

// Schema for a single message in a conversation
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Schema for a chat session (collection of messages)
const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Conversation",
      maxlength: 100,
    },
    messages: [messageSchema],
    // Track what topics were discussed
    tags: [String],
    // Is this session still active?
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Auto-manage createdAt and updatedAt
    timestamps: true,
  }
);

// Before saving, auto-generate a title from the first user message
chatSessionSchema.pre("save", function (next) {
  if (this.messages.length > 0 && this.title === "New Conversation") {
    const firstUserMsg = this.messages.find((m) => m.role === "user");
    if (firstUserMsg) {
      // Trim to 60 chars for the title
      this.title = firstUserMsg.content.substring(0, 60).trim();
      if (firstUserMsg.content.length > 60) this.title += "...";
    }
  }
  next();
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);
