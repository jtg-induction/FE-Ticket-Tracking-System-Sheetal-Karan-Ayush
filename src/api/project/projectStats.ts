import { api } from "@api/axios";

type DeadlineStatsResponse = {
    day_difference: number;
    count: number;
};
type TicketStatusCount = {
    status: string;
    count: number;
}

type TicketPriorityCount = {
    priority: string;
    count: number;
}

export const getTicketDeadlineStats = async (
    projectKey: string,
): Promise<DeadlineStatsResponse[]> => {
    const response = await api.get<DeadlineStatsResponse[]>(
        `api/reports/project/${projectKey}/ticket/deadline`,
    );
    return response.data;
};

export const getTicketStatusStats = async (
    projectKey: string,
): Promise<TicketStatusCount[]> => {
    const response = await api.get<TicketStatusCount[]>(
        `api/reports/project/${projectKey}/ticket/status`,
    );
    return response.data;
};

export const getTicketPriorityStats = async (
    projectKey: string,
): Promise<TicketPriorityCount[]> => {
    const response = await api.get<TicketPriorityCount[]>(
        `api/reports/project/${projectKey}/ticket/priority`,
    );
    return response.data;
};
