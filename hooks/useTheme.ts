"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Custom hook to safely interact with next-themes and avoid hydration mismatch.
 */
export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    theme,
    resolvedTheme: mounted ? resolvedTheme : "dark",
    setTheme,
    systemTheme,
    toggleTheme,
    isDark: mounted ? resolvedTheme === "dark" : true,
    mounted,
  };
}
