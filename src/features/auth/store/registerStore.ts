import { create } from 'zustand';
import { RegisterInput } from '../registerShema';

interface RegisterState extends RegisterInput {
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
    resetForm: () => void;
}

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export const useRegisterStore = create<RegisterState>((set) => ({
    ...initialState,

    setName: (name) => set({ name }),
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
    setConfirmPassword: (confirmPassword) => set({ confirmPassword }),

    resetForm: () => set(initialState),
}));
