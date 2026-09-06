import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import ChatBox from "../components/ChatBox.jsx";
import SettingsPanel from "../components/SettingsPanel.jsx";
import { exportConversationAsMarkdown } from "../utils/exportChat.js";

const PERSONA_LABEL = { mentor: "Mentor", developer: "Developer", quick: "Quick" };

export default function Workspace({
  projects,
  projectsLoading,
  loadError,
  activeProject,
  onSelectProject,
  onNewProject,
  onTogglePin,
  onDeleteProject,
  onSend,
  onQuickAction,
  isLoading,
  error,
  lastAiMessageId,
  onSaveSettings,
  userEmail,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draftSettings, setDraftSettings] = useState(activeProject?.settings);

  const isUntouchedProject = activeProject && activeProject.messages.length === 0;

  useEffect(() => {
    if (isUntouchedProject) {
      setDraftSettings(activeProject.settings);
      setSettingsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject?.id]);

  const openSettings = () => {
    setDraftSettings(activeProject?.settings);
    setSettingsOpen(true);
    setSidebarOpen(false);
  };

  const handleSave = () => {
    onSaveSettings(draftSettings);
    setSettingsOpen(false);
  };

  const settings = activeProject?.settings || {
    persona: "mentor",
    experienceLevel: "beginner",
    language: "id",
    projectType: "web",
  };

  return (
    <div className="h-screen flex bg-paper overflow-hidden">
      <Sidebar
        projects={projects}
        projectsLoading={projectsLoading}
        activeProjectId={activeProject?.id}
        onSelectProject={(id) => {
          onSelectProject(id);
          setSidebarOpen(false);
        }}
        onNewProject={() => {
          onNewProject();
          setSidebarOpen(false);
        }}
        onOpenSettings={openSettings}
        onTogglePin={onTogglePin}
        onDeleteProject={onDeleteProject}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userEmail={userEmail}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 border-b border-navy/10 bg-white px-4 md:px-8 py-3">
          <button
            type="button"
            className="md:hidden text-navy text-xl"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="min-w-0">
            <p className="font-display font-semibold text-navy text-sm md:text-base truncate">
              {activeProject?.name || "ProjectPilot AI"}
            </p>
            <p className="text-xs text-ink/40">Your AI project planning workspace</p>
          </div>

          {activeProject && activeProject.messages.length > 0 && (
            <button
              type="button"
              onClick={() => exportConversationAsMarkdown(activeProject)}
              title="Export percakapan ini sebagai file Markdown"
              className="shrink-0 flex items-center gap-1 text-xs font-medium text-ink/60 hover:text-navy border border-navy/10 hover:border-navy/25 rounded-full px-2.5 py-1 transition-colors ml-auto"
            >
              <Download size={12} /> Export
            </button>
          )}

          <button
            type="button"
            onClick={openSettings}
            title="Klik untuk mengubah gaya bicara, level pengalaman, dan bahasa AI"
            className={`shrink-0 text-xs font-medium text-redline bg-redline/10 hover:bg-redline/15 border border-redline/20 rounded-full px-2.5 py-1 transition-colors ${
              activeProject && activeProject.messages.length > 0 ? "" : "ml-auto"
            }`}
          >
            {PERSONA_LABEL[settings.persona] || "Mentor"} · {settings.experienceLevel} · ubah ⚙️
          </button>
        </header>

        {loadError && (
          <p className="bg-redline/5 text-redline text-sm px-4 md:px-8 py-2 border-b border-redline/20">
            {loadError}
          </p>
        )}

        <ChatBox
          messages={activeProject?.messages || []}
          isLoading={isLoading}
          error={error}
          lastAiMessageId={lastAiMessageId}
          onSend={onSend}
          onQuickAction={onQuickAction}
        />
      </div>

      {settingsOpen && (
        <SettingsPanel
          settings={draftSettings}
          onChange={setDraftSettings}
          onClose={() => setSettingsOpen(false)}
          onSave={handleSave}
          isNewProject={isUntouchedProject}
        />
      )}
    </div>
  );
}