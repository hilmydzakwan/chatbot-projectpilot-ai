// Canned prompts injected when the user clicks a Quick Action button.
// Kept on the backend so the frontend just sends an action key.

export const QUICK_ACTION_PROMPTS = {
  generateProject:
    "Based on everything discussed so far (or ask me for my idea if we haven't started), generate a full PROJECT OVERVIEW with these sections: Project Name, Project Type, Problem, Target Users, Solution, and Core Features (as a bullet list).",
  requirements:
    "Generate a list of Functional Requirements for the project we've been discussing. Format each as 'FR-0X — Title' followed by one sentence describing what the system must do.",
  techStack:
    "Recommend a technology stack (Frontend, Backend, Database, Authentication, AI/other) for the project we've been discussing. For each choice, give a one-sentence reason it fits this specific project.",
  database:
    "Design a database structure for the project we've been discussing. List each TABLE with its columns, then briefly explain the relationships between tables.",
  roadmap:
    "Create a phased Development Roadmap for the project we've been discussing. Break it into phases (e.g. Setup, Database, Core Features, AI Integration, Testing, Deployment) with a short bullet list of tasks under each phase.",
};

export function resolveQuickAction(actionKey) {
  return QUICK_ACTION_PROMPTS[actionKey] || null;
}
