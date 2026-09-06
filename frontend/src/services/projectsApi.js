import { supabase } from "./supabaseClient.js";

const DEFAULT_PROJECT_SETTINGS = {
  persona: "mentor",
  experienceLevel: "beginner",
  language: "id",
  projectType: "web",
};

export async function fetchProjects() {
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("id, name, pinned, settings, created_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (projectsError) throw projectsError;
  if (!projects || projects.length === 0) return [];

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("id, project_id, role, text, created_at")
    .in(
      "project_id",
      projects.map((p) => p.id)
    )
    .order("created_at", { ascending: true });

  if (messagesError) throw messagesError;

  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    pinned: !!p.pinned,
    settings: { ...DEFAULT_PROJECT_SETTINGS, ...(p.settings || {}) },
    messages: (messages || [])
      .filter((m) => m.project_id === p.id)
      .map((m) => ({ id: m.id, role: m.role, text: m.text })),
  }));
}

export async function createProjectRow(name, settings) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name,
      user_id: userData.user.id,
      settings: settings || DEFAULT_PROJECT_SETTINGS,
    })
    .select("id, name, pinned, settings")
    .single();

  if (error) throw error;
  return data;
}

export async function renameProjectRow(projectId, name) {
  const { error } = await supabase.from("projects").update({ name }).eq("id", projectId);
  if (error) throw error;
}

export async function updateProjectSettingsRow(projectId, settings) {
  const { error } = await supabase.from("projects").update({ settings }).eq("id", projectId);
  if (error) throw error;
}

export async function togglePinRow(projectId, pinned) {
  const { error } = await supabase.from("projects").update({ pinned }).eq("id", projectId);
  if (error) throw error;
}

export async function deleteProjectRow(projectId) {
  // Messages cascade-delete automatically (see schema.sql FK ON DELETE CASCADE).
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw error;
}

export async function insertMessageRow(projectId, role, text) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ project_id: projectId, role, text })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export { DEFAULT_PROJECT_SETTINGS };