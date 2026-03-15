import { getAllTickets } from '@api/ticket/getAllTickets/getAllTicketsApi';
import { getAllTicketsJql } from '@api/ticket/getAllTickets/getAllTicketsJqlApi';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
    GetAllTicketsResponse,
    JqlQueryParams,
    QueryParams,
} from './getAllTickets.schema';


export const useGetAllTickets = (
    projectKey: string,
    isJqlQuery: boolean,
    params?: QueryParams,
    jqlParams?: JqlQueryParams
) => useInfiniteQuery<GetAllTicketsResponse, Error>({
        queryKey: ['tickets', projectKey, isJqlQuery ? jqlParams : params],

        queryFn: async ({ pageParam }) => {
            if (isJqlQuery) {
                if (!jqlParams) {
                    throw new Error('JQL parameters are required');
                }
                const data = await getAllTicketsJql(projectKey, {
                    ...jqlParams,
                    cursor: pageParam as string | undefined,
                });
                return data;
            }

            if (!params) {
                throw new Error('Query parameters are required');
            }
            const data = await getAllTickets(projectKey, {
                ...params,
                cursor: pageParam as string | undefined,
            });
            return data;
        },

        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,

        initialPageParam: undefined,
    });
