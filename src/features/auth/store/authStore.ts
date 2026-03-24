import { create } from 'zustand';

import { AuthStore } from './authStore.types';

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
            },
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
        }),
    clearAuth: () => set({ accessToken: null, user: null, refreshToken: null }),
}));
