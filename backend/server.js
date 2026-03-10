/**
 * F1 Intelligence – Express Server
 *
 * Entry point for the F1 Intelligence backend.
 * Loads environment variables, initialises middleware,
 * and mounts the chat API route.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const chatRouter = require("./routes/chat");
const dataRouter = require("./routes/f1data");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ─────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ─── Routes ────────────────────────────────────────────────

app.use("/api", chatRouter);
app.use("/api", dataRouter);

// Health-check endpoint
app.get("/", (_req, res) => {
    res.json({
        name: "F1 Intelligence API",
        version: "1.0.0",
        status: "running",
        endpoints: {
            chat: "POST /api/chat",
        },
    });
});

// ─── Start ─────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`\n🏎️  F1 Intelligence API is running on http://localhost:${PORT}`);
    console.log(`   POST /api/chat  – Send a message to the AI assistant\n`);
});

module.exports = app;
