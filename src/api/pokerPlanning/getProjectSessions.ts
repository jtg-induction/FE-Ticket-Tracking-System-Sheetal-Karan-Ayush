import z from "zod";

import { api } from "@api/axios";
import { SessionResponseSchema, SessionResponseType } from "@features/pokerPlanning/pokerSession/session.schemas";

export const fetchSessions = async (projectKey: string): Promise<SessionResponseType[]> => {
    const response = await api.get(`/projects/${projectKey}/sessions/`);
    return z.array(SessionResponseSchema).parse(response.data);
};
