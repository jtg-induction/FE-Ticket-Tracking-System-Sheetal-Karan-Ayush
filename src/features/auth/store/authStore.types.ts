import { AuthResponse } from '../schema';

export type AuthStore = {
    user: {
        id: number;
        name: string;
        email: string;
    } | null;

    isAuthenticated: boolean;
    isInitializing: boolean;

    setAuth: (data: AuthResponse) => void;
    clearAuth: () => void;
    finishInitializing: () => void;
};
