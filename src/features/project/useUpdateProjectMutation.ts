import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProject } from './api'; 
import { ProjectResponse } from './schema';

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ jira_project_key, data }: { jira_project_key: string; data: ProjectResponse }) =>
            updateProject(jira_project_key, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['projects'] });
        }
    });
};
