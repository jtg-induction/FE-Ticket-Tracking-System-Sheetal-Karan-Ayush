import { UserReportFilters } from '@pages';
import { useQuery } from '@tanstack/react-query';

import { getUserReport } from './api';

export const useUserReport = (
    email?: string,
    filters?: Partial<UserReportFilters>,
    cursor?: string,
    projectKey?: string,
) =>
    useQuery({
        queryKey: ['user-report', email, filters, cursor, projectKey],
        queryFn: () => {
            if (!email) throw new Error('Email is required');

            const mergedFilters: UserReportFilters = {
                status: [],
                priority: [],
                ticketType: [],
                sort: 'latest',
                createdFrom: undefined,
                createdTo: undefined,
                deadlineFrom: undefined,
                deadlineTo: undefined,
                limit: 10,
                ...filters,
            };

            return getUserReport(mergedFilters, email, cursor, projectKey);
        },
        enabled: !!email,
        placeholderData: (prev) => prev,
        refetchOnMount: 'always',
    });
