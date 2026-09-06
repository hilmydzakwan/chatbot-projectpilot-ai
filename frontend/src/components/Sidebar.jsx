import { useState } from "react";
import { Pin, Trash2 } from "lucide-react";
import Logo from "./Logo.jsx";

export default function Sidebar({
  projects,
  projectsLoading,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onOpenSettings,
  onTogglePin,
  onDeleteProject,
  isOpen,
  onClose,
  userEmail,
  onLogout,
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-charcoal text-paper flex flex-col transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2">
          <Logo className="h-6" />
          <p className="text-[11px] tracking-wide text-gridline/90">AI PROJECT PLANNER</p>
        </div>

        <div className="px-3 pt-4">
          <button
            type="button"
            onClick={onNewProject}
            className="w-full flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-paper text-sm font-medium px-3 py-2.5 transition-colors"
          >
            <span aria-hidden="true">+</span> New Project
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 mt-4 space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-paper/40 px-2 mb-1">Projects</p>
          {projectsLoading && <p className="text-sm text-paper/50 px-2">Memuat project...</p>}
          {!projectsLoading && projects.length === 0 && (
            <p className="text-sm text-paper/50 px-2">
              Belum ada project tersimpan. Mulai chat dan project otomatis muncul di sini.
            </p>
          )}
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group relative flex items-center rounded-lg transition-colors ${
                project.id === activeProjectId ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={`flex-1 min-w-0 text-left text-sm px-2.5 py-2 truncate flex items-center gap-1.5 ${
                  project.id === activeProjectId ? "text-white" : "text-paper/70"
                }`}
                title={project.name}
              >
                {project.pinned && (
                  <Pin size={11} className="shrink-0 fill-redline text-redline" />
                )}
                <span className="truncate">{project.name}</span>
              </button>

              <div className="hidden group-hover:flex items-center gap-0.5 pr-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onTogglePin(project.id, !project.pinned)}
                  title={project.pinned ? "Unpin" : "Pin"}
                  className="p-1 rounded hover:bg-white/10 text-paper/60 hover:text-white"
                >
                  <Pin size={13} className={project.pinned ? "fill-current" : ""} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(project.id)}
                  title="Delete"
                  className="p-1 rounded hover:bg-redline/20 text-paper/60 hover:text-redline"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {confirmDeleteId === project.id && (
                <div
                  className="absolute inset-0 z-10 flex items-center justify-between gap-2 bg-charcoal-light rounded-lg px-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-xs text-paper/80 truncate">Hapus project ini?</span>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteProject(project.id);
                        setConfirmDeleteId(null);
                      }}
                      className="text-xs bg-redline hover:bg-redline-hover text-white rounded px-2 py-1"
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-paper rounded px-2 py-1"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          {userEmail && (
            <div className="flex items-center justify-between px-2.5">
              <span className="text-xs text-paper/50 truncate" title={userEmail}>
                {userEmail}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-paper/50 hover:text-white shrink-0 ml-2"
              >
                Logout
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 text-sm text-paper/80 hover:text-white px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <span aria-hidden="true">⚙️</span> Settings
          </button>
          <p className="text-[11px] text-paper/35 px-2.5 leading-snug">
            Atur persona, level pengalaman, bahasa &amp; tipe project AI di sini.
          </p>
        </div>
      </aside>
    </>
  );
}