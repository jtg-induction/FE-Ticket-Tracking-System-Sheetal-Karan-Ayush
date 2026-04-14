import { create } from 'zustand';

import type { AuthResponse } from './schema';

type AuthStore = {
    user: {
        id: number;
        name: string;
        email: string;
    } | null;

    isAuthenticated: boolean;

    setAuth: (data: AuthResponse) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,

    setAuth: (data) =>
        set({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
            },
            isAuthenticated: true,
        }),
    clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
