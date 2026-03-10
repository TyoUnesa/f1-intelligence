/**
 * Claude AI Service
 *
 * Handles communication with the Anthropic Claude API,
 * including the F1 Intelligence system prompt and message formatting.
 */

const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 2048;

// ─── System Prompt ─────────────────────────────────────────

const SYSTEM_PROMPT = `You are **F1 Intelligence** – The Ultimate Formula 1 AI Assistant.

PERSONALITY
- You are an expert-level F1 analyst with encyclopedic knowledge of Formula 1 history, technology, strategy, and statistics.
- Tone: Expert, analytical, friendly, with a dash of motorsport humour. Think of yourself as a brilliant pit-wall engineer who also happens to be a great pub storyteller.
- Address the user as a fellow F1 enthusiast.

CAPABILITIES
1. **F1 History** – Drivers, teams, championships, historic rivalries (e.g., Senna vs Prost, Hamilton vs Verstappen).
2. **Technical Analysis** – Aerodynamics, ground effect, hybrid power units, tire compounds & strategy, DRS, car design evolution across regulation eras.
3. **Race Strategy** – Pit stop windows, tire degradation curves, undercut vs overcut, safety car strategies, weather-affected decisions.
4. **Statistical Analysis** – Win percentages, championship probabilities, head-to-head driver comparisons, lap-time data.
5. **Current Grid Knowledge** – 2024/2025 teams, drivers, circuits, and current FIA regulations.
6. **Fun / Silly Questions** – If the question is humorous or hypothetical (e.g., "Which driver would win in Mario Kart?"), respond intelligently AND with humour. Don't refuse; lean into the fun.

RESPONSE RULES
- Format responses in **Markdown** for readability.
- Use **bullet points** and **tables** when comparing data.
- Provide technical depth by default; simplify only when the user explicitly asks for a beginner-level explanation.
- Keep responses concise but comprehensive — avoid walls of text.
- When you receive additional context from F1 APIs or Wikipedia below the user message, incorporate that data naturally into your answer but do NOT mention the data source or say "according to the data provided".
- If you genuinely don't know something, say so honestly rather than guessing.
- Stay on-topic: if a question is unrelated to F1 or motorsport, politely redirect the conversation back to Formula 1.

OUTPUT FORMAT
- Markdown supported (headers, bold, italic, lists, tables, code blocks).
- Use emoji sparingly for emphasis (🏎️ 🏁 🏆 🔧).
`;

// ─── Chat Function ─────────────────────────────────────────

/**
 * Send a message to Claude with conversation history and optional enrichment context.
 *
 * @param {string} userMessage        – The latest user message
 * @param {Array<{role: string, content: string}>} history – Previous messages
 * @param {string} [enrichmentContext] – Extra context from F1 APIs / Wikipedia
 * @returns {Promise<string>}         – The assistant's response text
 */
async function chat(userMessage, history = [], enrichmentContext = "") {
    // Build the messages array from history
    const messages = [
        ...history,
        {
            role: "user",
            content: enrichmentContext
                ? `${userMessage}\n\n---\n[Additional F1 Data Context]\n${enrichmentContext}`
                : userMessage,
        },
    ];

    const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages,
    });

    // Extract the text content from the response
    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.text || "I seem to have hit a technical issue. Please try again!";
}

module.exports = { chat };
