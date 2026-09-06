import Icon from "./Icon.jsx";

const ACTIONS = [
  { key: "generateProject", label: "Generate Project", icon: "idea", emoji: "💡" },
  { key: "requirements", label: "Requirements", icon: "requirements", emoji: "📋" },
  { key: "techStack", label: "Tech Stack", icon: "techstack", emoji: "🛠️" },
  { key: "database", label: "Database", icon: "database", emoji: "🗄️" },
  { key: "roadmap", label: "Roadmap", icon: "roadmap", emoji: "🗺️" },
];

export default function QuickActions({ onAction, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map((action) => (
        <button
          key={action.key}
          type="button"
          disabled={disabled}
          onClick={() => onAction(action.key)}
          className="flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs md:text-sm font-medium text-navy hover:border-redline hover:text-redline transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon name={action.icon} emoji={action.emoji} alt={action.label} className="w-4 h-4" />
          {action.label}
        </button>
      ))}
    </div>
  );
}

export { ACTIONS };