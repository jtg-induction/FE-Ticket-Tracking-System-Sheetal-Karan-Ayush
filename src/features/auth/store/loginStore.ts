import { create } from 'zustand';
import { LoginInput } from '../loginSchema';

interface LoginState extends LoginInput {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    resetForm: () => void;
}

const initialState = {
    email: '',
    password: '',
};

export const useLoginStore = create<LoginState>((set) => ({
    ...initialState,

    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),

    resetForm: () => set(initialState),
}));
