/**
 * Chat Route – POST /api/chat
 *
 * Accepts { message, session_id } and returns { response }.
 * Handles conversation memory and F1 data enrichment.
 */

const express = require("express");
const router = express.Router();

const claudeService = require("../services/claude");
const f1api = require("../services/f1api");
const { getHistory, addMessage } = require("../memory/sessionMemory");

router.post("/chat", async (req, res) => {
    try {
        const { message, session_id } = req.body;

        // ── Validate ────────────────────────────────────────────
        if (!message || typeof message !== "string") {
            return res
                .status(400)
                .json({ error: "Missing or invalid 'message' field (string required)." });
        }
        if (!session_id || typeof session_id !== "string") {
            return res
                .status(400)
                .json({ error: "Missing or invalid 'session_id' field (string required)." });
        }

        // ── Retrieve conversation history ───────────────────────
        const history = getHistory(session_id);

        // ── Enrich context with F1 / Wikipedia data ─────────────
        const enrichmentContext = await f1api.enrichContext(message);

        // ── Call Claude ─────────────────────────────────────────
        const assistantResponse = await claudeService.chat(
            message,
            history,
            enrichmentContext
        );

        // ── Update memory ───────────────────────────────────────
        addMessage(session_id, "user", message);
        addMessage(session_id, "assistant", assistantResponse);

        // ── Respond ─────────────────────────────────────────────
        return res.json({ response: assistantResponse });
    } catch (err) {
        console.error("Chat route error:", err);

        // Surface Anthropic API errors with a friendlier message
        if (err?.status === 401) {
            return res
                .status(500)
                .json({ error: "Invalid Anthropic API key. Check your .env configuration." });
        }

        return res
            .status(500)
            .json({ error: "An internal error occurred. Please try again later." });
    }
});

module.exports = router;
