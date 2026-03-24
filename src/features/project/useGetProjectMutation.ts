import { useQuery } from '@tanstack/react-query';

import { getProject } from './api';
import { ProjectResponse } from './schema';

export const useGetProject = (projectKey?: string) =>
    useQuery<ProjectResponse>({
        queryKey: ['project', projectKey],
        queryFn: async () => {
            if (!projectKey) throw new Error('Project key is required');
            return getProject(projectKey);
        },
        enabled: !!projectKey,
        staleTime: 1000 * 60 * 5, 
    });
