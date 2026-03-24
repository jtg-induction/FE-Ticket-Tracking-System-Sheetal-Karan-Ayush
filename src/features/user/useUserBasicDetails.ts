import { useEffect } from 'react';

import { useAuthStore } from '@features/auth';
import { useQuery } from '@tanstack/react-query';

import { getUserBasicDetails } from './api';

export const useUserBasicDetails = (enabled = true) => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const query = useQuery({
        queryKey: ['user-basic-details'],
        queryFn: getUserBasicDetails,
        enabled,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setAuth({
                id: query.data.id,
                name: query.data.name,
                email: query.data.email,
                access_token: localStorage.getItem('access_token') as string,
                refresh_token: localStorage.getItem('refresh_token') as string,
            });
        }
    }, [query.isSuccess, query.data, setAuth]);

    return query;
};
