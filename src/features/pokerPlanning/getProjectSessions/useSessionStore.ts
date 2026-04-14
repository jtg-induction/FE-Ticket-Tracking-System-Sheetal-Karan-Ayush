import { create } from "zustand";

import { SessionResponseType } from "../createSession/session.schemas";


interface SessionState {
    sessions: SessionResponseType[];
    setSessions: (sessions: SessionResponseType[]) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessions: [],
    setSessions: (sessions) => set({ sessions }),
}));
