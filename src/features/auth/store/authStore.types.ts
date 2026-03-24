import { AuthResponse } from '../schema';

export type AuthStore = {
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
