import { api } from "@api/axios";
import { SessionResponseSchema } from "@features/pokerPlanning/pokerSession/session.schemas";

export const joinSessionApi = async (sessionId: number, role: number) => {
    const response = await api.post(
        `/sessions/${sessionId}/join`, null, {
        params: { role }
    }
    );
    return SessionResponseSchema.parse(response.data);
};
