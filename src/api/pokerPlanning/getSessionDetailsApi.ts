import { api } from "@api/axios";
import { SessionResponseSchema } from "@features/pokerPlanning/pokerSession/session.schemas";

export const fetchSessionDetails = async (sessionId: number) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return SessionResponseSchema.parse(response.data);
};
