import { useState, useEffect } from "react";

const INTERVAL_MS = 30 * 60 * 1000;

export function useAutoRefresh() {
  const [secondsLeft, setSecondsLeft] = useState(INTERVAL_MS / 1000);

  useEffect(() => {
    const start = Date.now();

    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, INTERVAL_MS - elapsed);
      setSecondsLeft(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        clearInterval(tick);
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const label = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const pct = (secondsLeft / (INTERVAL_MS / 1000)) * 100;

  return { label, pct, secondsLeft };
}
