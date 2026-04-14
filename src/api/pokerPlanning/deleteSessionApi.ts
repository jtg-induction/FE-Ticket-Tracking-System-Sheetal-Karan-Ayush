import { api } from "@api/axios";

export const deleteSessionApi = async (sessionId: number): Promise<void> => {
    await api.delete(`sessions/${sessionId}`);
};
