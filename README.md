# ProjectPilot AI

**Turn Your Ideas Into Real Projects.**

ProjectPilot AI is an AI-powered project planning assistant that helps students and developers
transform a raw software idea into a structured, actionable development plan — project overview,
requirements, tech stack, database design, and a development roadmap — through a conversational
workspace powered by the Google Gemini API.

🔗 **Live Demo:** https://chatbot-projectpilot-ai.vercel.app/

## Features

- **AI Chat** with persistent conversation memory, saved per project to a real database
- **Google Login** — projects and chat history are tied to your account, not just your browser
- **Project Generator** — turns a one-line idea into a full project overview
- **Requirements Generator** — functional requirements (FR-01, FR-02, ...)
- **Tech Stack Advisor** — stack recommendation with reasoning, tailored per project
- **Database Generator** — table structure + relationships
- **Development Roadmap** — phased plan from setup to deployment
- **Per-project AI settings** — Persona (Mentor / Developer / Quick), Experience Level
  (Beginner / Intermediate / Advanced), Language (Bahasa Indonesia / English), and Project Type —
  each project remembers its own configuration, saved to the database
- **Pin & delete** projects from the sidebar
- **Export conversation** as a Markdown file (handy for continuing the discussion in Claude,
  ChatGPT, or anywhere else)
- Bilingual landing page (English / Indonesian toggle)
- Multiple projects per account, each with its own chat history and settings

## Tech Stack

| Layer    | Tech                                                         |
|----------|---------------------------------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS + react-markdown                |
| Backend  | Node.js + Express                                              |
| AI       | Google Gemini API (`gemini-3.6-flash` via `@google/genai` Interactions API) |
| Auth & Database | Supabase (Google OAuth + Postgres with Row Level Security) |
| Hosting  | Vercel (frontend + backend) · Supabase (auth + database)        |

## Project Structure

\`\`\`
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
├── frontend/
│   ├── public/
│   │   ├── logo.png            (your custom logo — see below)
│   │   └── icons/               (your custom quick-action icons — see below)
│   ├── src/
│   │   ├── components/ (Sidebar, ChatBox, MessageBubble, QuickActions, SettingsPanel,
│   │   │                EmptyState, Icon, Logo)
│   │   ├── pages/ (Home, Workspace)
│   │   ├── services/ (api.js, supabaseClient.js, projectsApi.js)
│   │   ├── utils/exportChat.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── supabase/
    ├── schema.sql                       (run first)
    └── migration_002_pin_and_settings.sql  (run second)
\`\`\`

## How to Run Locally

### 1. Get a Gemini API key
Go to [Google AI Studio](https://aistudio.google.com/) → generate an API key.

### 2. Set up Supabase (Auth + Database)
1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `supabase/schema.sql`, then `supabase/migration_002_pin_and_settings.sql`.
3. Under Authentication → Providers, enable **Google** (requires a Google Cloud OAuth Client ID
   and Secret — see [Google Cloud Console](https://console.cloud.google.com)).
4. Under Settings → API, copy your **Project URL** and **Publishable (anon) key**.

### 3. Backend

\`\`\`bash
cd backend
npm install
cp .env.example .env
# open .env and paste your GEMINI_API_KEY
npm start
\`\`\`
Backend runs at `http://localhost:5000`.

### 4. Frontend

In a new terminal:

\`\`\`bash
cd frontend
npm install
cp .env.example .env
# fill in VITE_API_BASE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev
\`\`\`
Frontend runs at `http://localhost:5173`.

### 5. Try it

Open `http://localhost:5173`, click **Start Building**, sign in with Google, and type something like:

> "Saya ingin membuat aplikasi untuk membantu UMKM mengelola stok barang."

You'll be prompted to configure the AI's Persona, Experience Level, Language, and Project Type for
this new project first. Then try the Quick Action buttons (Requirements, Tech Stack, Database,
Roadmap), pin/delete projects from the sidebar, and export a conversation to Markdown.

## Custom Branding

The app ships with emoji placeholders that automatically upgrade to custom images the moment you
add them — no code changes needed:

- `frontend/public/logo.png` — replaces the "ProjectPilot" text wordmark everywhere
- `frontend/public/icons/idea.png`, `requirements.png`, `techstack.png`, `database.png`,
  `roadmap.png`, `wave.png`, `memory.png` — replace the emoji icons

## Security

- The Gemini API key lives only in the backend's environment variables and is never exposed to
  the frontend. The React app talks exclusively to the Express backend, which is the only place
  that calls the Gemini API.
- The Supabase anon/publishable key is safe to expose in the frontend by design — actual data
  access is enforced server-side by Row Level Security policies (see `supabase/schema.sql`), so a
  user can only ever read or write their own projects and messages.

## Deployment

This project is deployed entirely on free tiers:

- **Frontend** — Vercel (Root Directory: `frontend`)
- **Backend** — Vercel, as a second project (Root Directory: `backend`) — Vercel auto-detects and
  deploys Express apps with zero extra configuration
- **Auth & Database** — Supabase

After deploying, remember to add your production frontend URL to Supabase under
**Authentication → URL Configuration** (both Site URL and Redirect URLs), or Google login will
redirect back to `localhost` instead of your live site.

## Screenshots

_Add screenshots here: Landing Page, Empty Workspace, Conversation, Project Generator result,
Requirements result, Tech Stack result, Database result, Roadmap result, Settings page._

---

Built by **[Hilmy Dzakwan](https://github.com/hilmydzakwan)** for the *AI Productivity and AI API
Integration for Developers* course at Hacktiv8.
