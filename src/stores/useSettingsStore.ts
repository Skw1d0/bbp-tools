import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsStoreProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const useSettingsStore = create<SettingsStoreProps>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        if (get().theme === "light") {
          set({ theme: "dark" });
        } else {
          set({ theme: "light" });
        }
      },
    }),
    { name: "bbp-tools-settings-store", version: 1 }
  )
);

export default useSettingsStore;
