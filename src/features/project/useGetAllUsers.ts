import { useInfiniteQuery } from '@tanstack/react-query';

import { getAllUsers } from './api';
import { GetAllUsersRequest, GetAllUsersResponse } from './schema';

export const useGetAllUsers = (payload: GetAllUsersRequest) =>
    useInfiniteQuery<GetAllUsersResponse, Error>({
        queryKey: ['project-users', payload.projectKey, payload.userName],
        queryFn: async ({ pageParam }) => {
            const data = await getAllUsers({
                ...payload,
                offset: pageParam as number,
            });
            return data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const LIMIT = 10;
            if (lastPage.length < LIMIT) return undefined;
            const loaded = allPages.flat().length;
            return loaded;
        },
    });
