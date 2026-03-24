import { getAllTickets } from '@api/ticket/getAllTickets/getAllTicketsApi';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
    GetAllTicketsResponse,
    QueryParams,
} from './getAllTickets.schema';


export const useGetAllTickets = (
    projectKey: string,
    params: QueryParams,
    options: { enabled: boolean },
) => useInfiniteQuery<GetAllTicketsResponse, Error>({
        queryKey: ['tickets', 'list', projectKey, params],

        queryFn: async ({ pageParam }) => {
            const data = await getAllTickets(projectKey, {
                ...params,
                cursor: pageParam as string | undefined,
            });
            return data;
        },

        initialPageParam: undefined,

        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
        ...options,
    })
