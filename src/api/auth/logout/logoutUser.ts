import { api } from "@api";

export const logoutUser = async (): Promise<void> => {
    await api.post('/api/auth/logout');
};
