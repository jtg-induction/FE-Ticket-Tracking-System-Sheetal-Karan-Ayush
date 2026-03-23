import { create } from 'zustand';

import type { AuthResponse } from './schema';

type AuthStore = {
    user: {
        id: number;
        name: string;
        email: string;
        avatarId: number;
    } | null;

    accessToken: string | null;
    refreshToken: string | null;

    setAuth: (data: AuthResponse) => void;
    clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    setAuth: (data) =>
        set({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                avatarId: data.avatar_id,
            },
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        }),
    clearAuth: () => set({ accessToken: null, user: null, refreshToken: null }),
}));
