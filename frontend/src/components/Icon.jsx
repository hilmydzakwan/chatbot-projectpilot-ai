import { useState } from "react";

export default function Icon({ name, emoji, alt = "", className = "" }) {
  const [errored, setErrored] = useState(false);

  if (errored || !name) {
    return (
      <span className={className} role="img" aria-label={alt || name}>
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={`/icons/${name}.png`}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}