import { create } from 'zustand';

import { AuthStore } from './authStore.types';

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isInitializing: true,
    setAuth: (data) =>
        set({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
            },
            isAuthenticated: true,
            isInitializing: false,
        }),
    clearAuth: () =>
        set({
            user: null,
            isAuthenticated: false,
            isInitializing: false,
        }),
    finishInitializing: () => set({ isInitializing: false }),
}));
