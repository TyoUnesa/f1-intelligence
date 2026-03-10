/**
 * Session Memory Manager
 *
 * In-memory conversation history storage per session.
 * Each session stores an array of { role, content } messages,
 * capped at the last MAX_MESSAGES entries.
 */

const MAX_MESSAGES = 10;

/** @type {Map<string, Array<{role: string, content: string}>>} */
const sessions = new Map();

/**
 * Get conversation history for a session.
 * @param {string} sessionId
 * @returns {Array<{role: string, content: string}>}
 */
function getHistory(sessionId) {
    return sessions.get(sessionId) || [];
}

/**
 * Append a message and trim history to the last MAX_MESSAGES entries.
 * @param {string} sessionId
 * @param {"user"|"assistant"} role
 * @param {string} content
 */
function addMessage(sessionId, role, content) {
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
    }

    const history = sessions.get(sessionId);
    history.push({ role, content });

    // Keep only the last MAX_MESSAGES messages
    if (history.length > MAX_MESSAGES) {
        sessions.set(sessionId, history.slice(-MAX_MESSAGES));
    }
}

/**
 * Clear all history for a session.
 * @param {string} sessionId
 */
function clearSession(sessionId) {
    sessions.delete(sessionId);
}

module.exports = { getHistory, addMessage, clearSession };
