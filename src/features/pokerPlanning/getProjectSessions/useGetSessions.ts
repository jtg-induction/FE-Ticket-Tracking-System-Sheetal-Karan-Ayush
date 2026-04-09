import { fetchSessions } from "@api/pokerPlanning/getProjectSessions";
import { useQuery } from "@tanstack/react-query";


export const useGetSessions = (projectKey: string) =>
    useQuery({
        queryKey: ["sessions", projectKey],
        queryFn: () => fetchSessions(projectKey),
        enabled: !!projectKey,
    });
