import { getAllProjects } from '@api';
import { useQuery } from '@tanstack/react-query';

import { ProjectResponse } from '../schema';

export const useGetMyProjects = () =>
    useQuery<ProjectResponse[]>({
        queryKey: ['projects'],
        queryFn: getAllProjects,
    });
