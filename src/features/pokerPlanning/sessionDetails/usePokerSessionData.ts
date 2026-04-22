import { fetchSessionDetails } from "@api/pokerPlanning/getSessionDetailsApi";
import { fetchSessionTickets } from "@api/pokerPlanning/getSessionTicketsApi";
import { useQuery } from "@tanstack/react-query";

import { SessionResponseType } from "../pokerSession/session.schemas";

export const usePokerSessionData = (sessionId: number) =>
    useQuery<SessionResponseType, Error>({
        queryKey: ['session', sessionId],
        queryFn: () => fetchSessionDetails(sessionId),
    });

export const usePokerSessionTicketsData = (sessionId: number) =>
    useQuery({
        queryKey: ['session-tickets', Number(sessionId)],
        queryFn: () => fetchSessionTickets(sessionId),
    });
