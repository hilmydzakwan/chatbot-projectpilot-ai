import { useEffect, useMemo, useState } from "react";
import Home from "./pages/Home.jsx";
import Workspace from "./pages/Workspace.jsx";
import { sendChatMessage, sendQuickAction } from "./services/api.js";
import { supabase } from "./services/supabaseClient.js";
import {
  fetchProjects,
  createProjectRow,
  insertMessageRow,
  togglePinRow,
  deleteProjectRow,
  updateProjectSettingsRow,
  DEFAULT_PROJECT_SETTINGS,
} from "./services/projectsApi.js";

const IDLE_LIMIT_MS = 5 * 24 * 60 * 60 * 1000; // 5 days
const LAST_ACTIVE_KEY = "pp_last_active_at";

let tempIdCounter = 0;
const tempId = () => `tmp-${Date.now()}-${tempIdCounter++}`;

function newDraft(settings) {
  return {
    id: tempId(),
    name: "New Project",
    pinned: false,
    settings: settings || DEFAULT_PROJECT_SETTINGS,
    messages: [],
  };
}

const QUICK_ACTION_LABELS = {
  generateProject: "Generate Project",
  requirements: "Requirements",
  techStack: "Tech Stack",
  database: "Database",
  roadmap: "Roadmap",
};

export default function App() {
  const [view, setView] = useState("landing");
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [draftProject, setDraftProject] = useState(() => newDraft());
  const [activeProjectId, setActiveProjectId] = useState(() => draftProject.id);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAiMessageId, setLastAiMessageId] = useState(null);

  useEffect(() => {
    const lastActiveRaw = localStorage.getItem(LAST_ACTIVE_KEY);
    const lastActive = lastActiveRaw ? Number(lastActiveRaw) : null;
    const idleTooLong = lastActive && Date.now() - lastActive > IDLE_LIMIT_MS;

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session && idleTooLong) {
        await supabase.auth.signOut();
        setAuthChecked(true);
        return;
      }
      setSession(data.session);
      if (data.session) {
        localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
        setView("workspace");
      }
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "SIGNED_IN") {
        localStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
        setView("workspace");
      }
      if (event === "SIGNED_OUT") {
        localStorage.removeItem(LAST_ACTIVE_KEY);
        setView("landing");
        setProjects([]);
        setDraftProject(newDraft());
        setActiveProjectId(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    setProjectsLoading(true);
    setLoadError(null);
    fetchProjects()
      .then((loaded) => {
        if (cancelled) return;
        setProjects(loaded);
        setDraftProject((prev) =>
          prev && prev.messages.length === 0 && loaded[0]
            ? { ...prev, settings: loaded[0].settings }
            : prev
        );
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load projects:", err);
        setLoadError(
          "Gagal memuat project tersimpan. Cek konfigurasi Supabase kamu di frontend/.env."
        );
      })
      .finally(() => {
        if (!cancelled) setProjectsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  const activeProject = useMemo(() => {
    if (draftProject && draftProject.id === activeProjectId) return draftProject;
    return projects.find((p) => p.id === activeProjectId);
  }, [projects, draftProject, activeProjectId]);

  async function handleStartOrLogin() {
    if (session) {
      setView("workspace");
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: "select_account" },
      },
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function runRequest({ apiCall, userLabel, project }) {
    if (!project) return;
    setError(null);

    let isDraftNow = draftProject && draftProject.id === project.id;
    let dbProjectId = isDraftNow ? null : project.id;

    function writeMessages(updater) {
      if (isDraftNow) {
        setDraftProject((prev) =>
          prev && prev.id === project.id ? { ...prev, messages: updater(prev.messages) } : prev
        );
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === dbProjectId ? { ...p, messages: updater(p.messages) } : p))
        );
      }
    }

    try {
      if (userLabel) {
        if (isDraftNow && project.messages.length === 0) {
          const trimmed = userLabel.trim();
          const shortName = trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed;
          const createdProject = await createProjectRow(shortName || project.name, project.settings);
          const savedUserMsg = await insertMessageRow(createdProject.id, "user", userLabel);

          const promoted = {
            id: createdProject.id,
            name: createdProject.name,
            pinned: false,
            settings: createdProject.settings || project.settings,
            messages: [{ id: savedUserMsg.id, role: "user", text: userLabel }],
          };
          setProjects((prev) => [promoted, ...prev]);
          setDraftProject(newDraft(project.settings));
          setActiveProjectId(createdProject.id);

          isDraftNow = false;
          dbProjectId = createdProject.id;
        } else {
          const savedUserMsg = await insertMessageRow(dbProjectId, "user", userLabel);
          writeMessages((msgs) => [...msgs, { id: savedUserMsg.id, role: "user", text: userLabel }]);
        }
      }

      setIsLoading(true);
      const historyForApi = project.messages.map((m) => ({ role: m.role, text: m.text }));
      const result = await apiCall(historyForApi, project.settings);

      if (result.success) {
        const savedAiMsg = await insertMessageRow(dbProjectId, "ai", result.message);
        writeMessages((msgs) => [...msgs, { id: savedAiMsg.id, role: "ai", text: result.message }]);
        setLastAiMessageId(savedAiMsg.id);
      } else {
        setError(result.message || "Sorry, I couldn't process your request right now.");
      }
    } catch (err) {
      console.error("Chat request failed:", err);
      setError("Sorry, I couldn't process your request right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend(text) {
    if (!text.trim()) {
      setError("Please enter a message first.");
      return;
    }
    runRequest({
      project: activeProject,
      userLabel: text,
      apiCall: (history, settings) =>
        sendChatMessage({ message: text, conversationHistory: history, settings }),
    });
  }

  function handleQuickAction(actionKey) {
    runRequest({
      project: activeProject,
      userLabel: QUICK_ACTION_LABELS[actionKey] || actionKey,
      apiCall: (history, settings) =>
        sendQuickAction({ action: actionKey, conversationHistory: history, settings }),
    });
  }

  function handleNewProject() {
    const baseSettings = projects[0]?.settings || DEFAULT_PROJECT_SETTINGS;
    const project = newDraft(baseSettings);
    setDraftProject(project);
    setActiveProjectId(project.id);
    setError(null);
  }

  function handleSelectProject(id) {
    setActiveProjectId(id);
    setError(null);
  }

  function handleSaveSettings(newSettings) {
    if (!activeProject) return;
    const isDraftNow = draftProject && draftProject.id === activeProject.id;

    if (isDraftNow) {
      setDraftProject((prev) => (prev ? { ...prev, settings: newSettings } : prev));
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProject.id ? { ...p, settings: newSettings } : p))
      );
      updateProjectSettingsRow(activeProject.id, newSettings).catch((err) =>
        console.error("Failed to save project settings:", err)
      );
    }
  }

  function handleTogglePin(projectId, pinned) {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === projectId ? { ...p, pinned } : p));
      return [...updated].sort((a, b) => Number(b.pinned) - Number(a.pinned));
    });
    togglePinRow(projectId, pinned).catch((err) => console.error("Failed to toggle pin:", err));
  }

  function handleDeleteProject(projectId) {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProjectId === projectId) {
      handleNewProject();
    }
    deleteProjectRow(projectId).catch((err) => console.error("Failed to delete project:", err));
  }

  if (!authChecked) {
    return (
      <div className="h-screen flex items-center justify-center bg-paper text-ink/50 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <>
      {view === "landing" && <Home onStart={handleStartOrLogin} />}
      {view === "workspace" &&
        (session ? (
          <Workspace
            projects={projects}
            projectsLoading={projectsLoading}
            loadError={loadError}
            activeProject={activeProject}
            onSelectProject={handleSelectProject}
            onNewProject={handleNewProject}
            onTogglePin={handleTogglePin}
            onDeleteProject={handleDeleteProject}
            onSend={handleSend}
            onQuickAction={handleQuickAction}
            isLoading={isLoading}
            error={error}
            lastAiMessageId={lastAiMessageId}
            onSaveSettings={handleSaveSettings}
            userEmail={session.user?.email}
            onLogout={handleLogout}
          />
        ) : (
          <div className="h-screen flex flex-col items-center justify-center gap-4 bg-paper text-center px-6">
            <p className="text-ink/60">Sign in to continue to your workspace.</p>
            <button
              type="button"
              onClick={handleStartOrLogin}
              className="rounded-lg bg-redline hover:bg-redline-hover text-white font-medium px-6 py-3 transition-colors"
            >
              Continue with Google
            </button>
          </div>
        ))}
    </>
  );
}