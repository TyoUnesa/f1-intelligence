# 🏎️ F1 Intelligence – The Ultimate Formula 1 AI Assistant

An AI-powered chatbot backend specializing in everything Formula 1, built with **Node.js**, **Express**, and **Anthropic Claude**.

## Features

- 🤖 **Claude AI Integration** – Expert F1 responses with personality and humour
- 📊 **Ergast F1 API** – Live race results, driver standings, constructor standings
- 📖 **Wikipedia API** – Historical data enrichment
- 🧠 **Session Memory** – Per-session conversation history (last 10 messages)
- 🎯 **Intent Detection** – Automatically fetches relevant F1 data based on user queries

## Project Structure

```
backend/
├── server.js                  # Express entry point
├── routes/
│   └── chat.js                # POST /api/chat route
├── services/
│   ├── claude.js              # Anthropic Claude integration
│   └── f1api.js               # Ergast & Wikipedia API service
├── memory/
│   └── sessionMemory.js       # In-memory session storage
├── .env.example               # Environment variable template
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Anthropic API Key** – Get one at [console.anthropic.com](https://console.anthropic.com/)

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

### Running

**Development** (with auto-reload):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

The server starts at `http://localhost:3001`.

## API Reference

### Health Check

```
GET /
```

Returns API metadata and status.

### Chat

```
POST /api/chat
Content-Type: application/json
```

**Request Body:**

```json
{
  "message": "Who won the 2023 F1 championship?",
  "session_id": "user-123"
}
```

**Response:**

```json
{
  "response": "🏆 The 2023 Formula 1 World Championship was won by **Max Verstappen**..."
}
```

**Error Response (400):**

```json
{
  "error": "Missing or invalid 'message' field (string required)."
}
```

## Example Queries

| Query | Feature |
|-------|---------|
| `"Who won the 2021 Abu Dhabi GP?"` | Race result lookup (Ergast API) |
| `"Hamilton vs Schumacher statistics"` | Driver comparison |
| `"Explain DRS aerodynamics"` | Technical explanation |
| `"Driver standings 2023"` | Championship standings (Ergast API) |
| `"Which F1 driver would survive a zombie apocalypse?"` | Fun mode 🎉 |

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| AI Model | Claude Sonnet 4 (Anthropic) |
| F1 Data | Ergast API |
| Historical Data | Wikipedia API |
| Memory | In-memory Map |
