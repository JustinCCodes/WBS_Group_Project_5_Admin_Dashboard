"use client";

import { useEffect, useState } from "react";
import { getEnvMode, setEnvMode, EnvMode } from "@/src/shared/lib/urlResolver";

export default function EnvironmentSwitcher() {
  const [mode, setMode] = useState<EnvMode>("local");

  useEffect(() => {
    setMode(getEnvMode());
  }, []);

  const toggleMode = () => {
    const newMode = mode === "local" ? "production" : "local";
    setEnvMode(newMode);
  };

  return (
    <button
      onClick={toggleMode}
      type="button"
      className={`
        fixed bottom-4 right-4 px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all z-50
        ${
          mode === "local"
            ? "bg-amber-500 text-black hover:bg-amber-600"
            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-white"
        }
      `}
    >
      {mode === "local" ? "⚡ Localhost" : "☁️ Production"}
    </button>
  );
}
