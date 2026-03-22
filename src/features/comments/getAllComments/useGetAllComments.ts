import { getAllComments } from '@api/comments/getAllCommentsApi';
import { useInfiniteQuery } from '@tanstack/react-query';

import { GetAllCommentsFormData, GetAllCommentsResponse } from './getAllComments.schema';


export const useGetAllComments = (
    params: GetAllCommentsFormData,
    enabled: boolean = true,
) => useInfiniteQuery<GetAllCommentsResponse, Error>({
        queryKey: ['comments', params],

        queryFn: async ({ pageParam }) => getAllComments({...params, cursor: pageParam }),

        getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,

        initialPageParam: undefined,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 120,
        enabled,
    });
