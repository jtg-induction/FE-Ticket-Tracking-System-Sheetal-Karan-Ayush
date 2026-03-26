import { updateProject } from '@api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectUpdateData } from '../schema';

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            jira_project_key,
            data,
        }: {
            jira_project_key: string;
            data: ProjectUpdateData;
        }) => updateProject(jira_project_key, data),
        onSuccess: async (_updatedProject, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ['project', variables.jira_project_key],
            });
            await queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};
