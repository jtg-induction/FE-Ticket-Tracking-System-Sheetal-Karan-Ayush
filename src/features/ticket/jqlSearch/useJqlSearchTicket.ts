import { getAllTicketsJql } from '@api/ticket/getAllTickets/getAllTicketsJqlApi';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
    GetAllTicketsResponse,
    JqlQueryParams,
} from '../getAllTickets/getAllTickets.schema';

export const useJqlSearchTickets = (
    projectKey: string,
    jqlParams: JqlQueryParams,
    options: { enabled: boolean },
) =>
    useInfiniteQuery<GetAllTicketsResponse, Error>({
        queryKey: ['tickets', 'jql', projectKey, jqlParams],

        queryFn: async ({ pageParam }) => {
            const data = await getAllTicketsJql(projectKey, {
                ...jqlParams,
                cursor: pageParam as string | undefined,
            });
            return data;
        },
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
        ...options,
    });
