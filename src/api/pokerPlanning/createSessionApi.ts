import { SessionCreateType, SessionResponseSchema, SessionResponseType } from "@features/pokerPlanning/pokerSession/session.schemas";

import { api } from '../axios';


export const createSession = async (payload: SessionCreateType): Promise<SessionResponseType> => {
    const response = await api.post(`/sessions/`, payload);
    return SessionResponseSchema.parse(response.data);
};
