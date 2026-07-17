import { create } from "zustand";

const getInitialDarkMode = () => {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
};

export const useThemeStore = create((set, get) => ({
  darkMode: getInitialDarkMode(),
  setDarkMode: (darkMode) => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    set({ darkMode });
  },
  toggleDarkMode: () => {
    const next = !get().darkMode;
    localStorage.setItem("theme", next ? "dark" : "light");
    set({ darkMode: next });
  },
}));

export default useThemeStore;
