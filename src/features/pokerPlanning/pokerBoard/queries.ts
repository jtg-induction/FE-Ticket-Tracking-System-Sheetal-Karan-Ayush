import { fetchSessionDetails } from "@api/pokerPlanning/getSessionDetailsApi";
import { useQuery } from "@tanstack/react-query";

export const usePokerSessionData = (sessionId: number) => useQuery({
    queryKey: ['poker-session', sessionId],
    queryFn: () => fetchSessionDetails(sessionId),
    staleTime: Infinity,
});
