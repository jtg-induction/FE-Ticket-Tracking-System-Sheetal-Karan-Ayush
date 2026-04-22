import { useEffect } from 'react';

import { useAuthStore } from '@features/auth';
import { useQuery } from '@tanstack/react-query';

import { getUserBasicDetails } from './api';

export const useUserBasicDetails = (enabled = true) => {
    const setAuth = useAuthStore((state) => state.setAuth);

    const finishInitializing = useAuthStore((state) => state.finishInitializing);

    const query = useQuery({
        queryKey: ['user-basic-details'],
        queryFn: getUserBasicDetails,
        enabled,
        retry: false,
    });

    useEffect(() => {
        if (query.isSuccess && query.data) {
            setAuth({
                id: query.data.id,
                name: query.data.name,
                email: query.data.email,
            });
        }
        else if (query.isError) {
            finishInitializing(); 
        }
    }, [query.isSuccess, query.isError, query.data, setAuth, finishInitializing]);

    return query;
};
