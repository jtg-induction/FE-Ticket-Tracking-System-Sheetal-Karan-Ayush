import z from "zod";

import { api } from "@api/axios";
import { TicketResponseSchema, TicketResponseType } from "@features/pokerPlanning/createSession/session.schemas";

export const fetchSessionTickets = async (sessionId: number): Promise<TicketResponseType[]> => {
    const response = await api.get(`/sessions/${sessionId}/tickets/`);
    return z.array(TicketResponseSchema).parse(response.data);
};
