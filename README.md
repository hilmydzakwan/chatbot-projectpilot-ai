# ProjectPilot AI

**Turn Your Ideas Into Real Projects.**

ProjectPilot AI is an AI-powered project planning assistant that helps students and developers
transform a raw software idea into a structured, actionable development plan — project overview,
requirements, tech stack, database design, and a development roadmap — through a conversational
workspace powered by the Google Gemini API.

## Features

- **AI Chat** with persistent conversation context (memory) per project
- **Project Generator** — turns a one-line idea into a full project overview
- **Requirements Generator** — functional requirements (FR-01, FR-02, ...)
- **Tech Stack Advisor** — stack recommendation with reasoning, tailored per project
- **Database Generator** — table structure + relationships
- **Development Roadmap** — phased plan from setup to deployment
- Configurable **AI Persona** (Mentor / Developer / Quick)
- Configurable **Experience Level** (Beginner / Intermediate / Advanced)
- **Bahasa Indonesia / English** support
- **Project Type** selector (Web, Mobile, Desktop, AI, IoT, Data, Game)
- Multiple projects in one session, each with its own chat history

## Tech Stack

| Layer    | Tech                                   |
|----------|-----------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS + react-markdown |
| Backend  | Node.js + Express                      |
| AI       | Google Gemini API (`gemini-2.5-flash` via `@google/genai`) |

## Project Structure

```
projectpilot-ai/
├── backend/
│   ├── src/
│   │   ├── controllers/chatController.js
│   │   ├── routes/chatRoutes.js
│   │   ├── services/geminiService.js
│   │   ├── prompts/systemPrompt.js
│   │   ├── prompts/quickActionPrompts.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/ (Sidebar, ChatBox, MessageBubble, QuickActions, SettingsPanel, EmptyState)
    │   ├── pages/ (Home, Workspace)
    │   ├── services/api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## How to Run

### 1. Get a Gemini API key
Go to [Google AI Studio](https://aistudio.google.com/) → generate an API key.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# open .env and paste your GEMINI_API_KEY
npm start
```

Backend runs at `http://localhost:5000`.

### 3. Frontend

In a new terminal:

```bash
cd frontend
npm install
cp .env.example .env   # optional, defaults already point to localhost:5000
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 4. Try it

Open `http://localhost:5173`, click **Start Building**, and type something like:

> "Saya ingin membuat aplikasi untuk membantu UMKM mengelola stok barang."

Then try the Quick Action buttons (Requirements, Tech Stack, Database, Roadmap) and change
Persona / Experience Level / Language in **Settings** to see the AI's tone adapt.

## Security

The Gemini API key lives only in `backend/.env` and is never sent to or exposed by the frontend.
The React app talks exclusively to the Express backend (`/api/chat`, `/api/chat/quick-action`),
which is the only place that calls the Gemini API.

## Screenshots

_Add screenshots here: Landing Page, Empty Workspace, Conversation, Project Generator result,
Requirements result, Tech Stack result, Database result, Roadmap result, Settings page._
