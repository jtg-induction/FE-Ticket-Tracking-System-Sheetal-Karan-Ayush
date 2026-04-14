import { api } from "@api/axios";
import { SessionResponseSchema, SessionResponseType, SessionUpdateType } from "@features/pokerPlanning/createSession/session.schemas";

export const updateSessionApi = async (
    sessionId: number, 
    payload: SessionUpdateType
): Promise<SessionResponseType> => {
    const response = await api.patch(`sessions/${sessionId}`, payload);
    return SessionResponseSchema.parse(response.data);
};
