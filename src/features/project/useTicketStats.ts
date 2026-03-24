import { useQuery } from '@tanstack/react-query';

import {
    getTicketDeadlineStats,
    getTicketPriorityStats,
    getTicketStatusStats,
} from './api';

export const useTicketDeadlineStats = (projectKey?: string) =>
    useQuery({
        queryKey: ['ticket-deadline-stats', projectKey],
        queryFn: () => getTicketDeadlineStats(projectKey!),
        enabled: !!projectKey,
    });

export const useTicketStatusStats = (projectKey?: string) =>
    useQuery({
        queryKey: ['ticket-status-stats', projectKey],
        queryFn: () => getTicketStatusStats(projectKey!),
        enabled: !!projectKey,
    });

export const useTicketPriorityStats = (projectKey?: string) =>
    useQuery({
        queryKey: ['ticket-priority-counts', projectKey],
        queryFn: () => getTicketPriorityStats(projectKey!),
        enabled: !!projectKey,
    });
