import { type AuthResponse, authResponseSchema } from 'features/auth/schema';

import { api } from './axios'
import { handleApiError } from './handleApiError';

type SignupInput = {
    name: string;
    email: string;
    password: string;
    avatarId: number;
}

type LoginInput = {
    email: string;
    password: string;
}

export const signupUser = async (data: SignupInput): Promise<AuthResponse> => {
    try {
        const payload = {
            name: data.name, email: data.email, password: data.password, avatar_id: 1,
        }
        const response = await api.post("/api/auth/signup", payload);
        const parsed = authResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error("Invalid server response ");
        }
        return parsed.data
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

export const loginUser = async (data: LoginInput): Promise<AuthResponse> => {
    try {
        const payload = {
            email: data.email, password: data.password,
        }
        const response = await api.post("/api/auth/login", payload);
        const parsed = authResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error("Invalid server response ");
        }
        return parsed.data
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

