export function exportConversationAsMarkdown(project) {
  if (!project || project.messages.length === 0) return;

  const lines = [`# ${project.name}`, ""];
  project.messages.forEach((m) => {
    const label = m.role === "user" ? "**You**" : "**ProjectPilot AI**";
    lines.push(`${label}:`, "", m.text, "");
  });

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const filename = `${project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "conversation"}.md`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}