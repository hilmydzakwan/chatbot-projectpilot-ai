import { ACTIONS } from "./QuickActions.jsx";
import Icon from "./Icon.jsx";

export default function EmptyState({ onAction }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
      <img src="/logo.png" alt="ProjectPilot AI" className="w-14 h-14 object-contain mb-4" />
      <h2 className="font-display text-xl md:text-2xl font-semibold text-navy mb-1">
        Welcome to ProjectPilot AI
      </h2>
      <p className="text-ink/60 mb-6">What are you building today?</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full max-w-2xl">
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => onAction(action.key)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-navy/10 bg-white px-3 py-4 text-xs md:text-sm font-medium text-navy hover:border-redline hover:text-redline transition-colors shadow-sm"
          >
            <Icon name={action.icon} emoji={action.emoji} alt={action.label} className="w-5 h-5" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}