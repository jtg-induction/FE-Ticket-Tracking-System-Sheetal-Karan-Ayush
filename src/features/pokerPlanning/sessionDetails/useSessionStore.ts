import { create } from 'zustand';

interface SessionStore {
  activeSessionId: number | null;
  setActiveSessionId: (id: number | null) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  activeSessionId: null,
  setActiveSessionId: (id) => set({ activeSessionId: id }),
}));
