import { getAllTickets } from '@api/ticket/getAllTickets/getAllTicketsApi';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
    GetAllTicketsFormData,
    GetAllTicketsResponse,
} from './getAllTickets.schema';

export const useGetAllTickets = (
    projectKey: string,
    params: Omit<GetAllTicketsFormData, 'cursor'>,
) =>
    useInfiniteQuery<
        GetAllTicketsResponse,
        Error,
        GetAllTicketsResponse,
        (string | object)[],
        string | undefined
    >({
        queryKey: ['tickets', projectKey, params],

        queryFn: ({ pageParam }) =>
            getAllTickets(projectKey, {
                ...params,
                cursor: pageParam,
            }),

        initialPageParam: undefined,

        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    });
