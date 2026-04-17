import { create } from "zustand";

import { SessionResponseType } from "./session.schemas";

interface SessionState {
    currentSession: SessionResponseType | null;
    setSession: (session: SessionResponseType) => void;
    clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    currentSession: null,
    setSession: (session) => set({ currentSession: session }),
    clearSession: () => set({ currentSession: null }),
}));
