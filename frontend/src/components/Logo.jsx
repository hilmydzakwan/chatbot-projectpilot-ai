import { useState } from "react";

export default function Logo({ className = "h-8", compact = false }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return compact ? (
      <span className="font-display font-semibold text-[10px] leading-none">PP</span>
    ) : (
      <span className="font-display font-semibold text-lg leading-none">ProjectPilot</span>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="ProjectPilot AI"
      className={className}
      onError={() => setErrored(true)}
    />
  );
}