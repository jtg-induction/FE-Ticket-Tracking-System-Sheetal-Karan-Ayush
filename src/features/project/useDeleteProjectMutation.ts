import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProject } from './api';

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: async (_data, jira_project_key) => {
            await queryClient.invalidateQueries({ queryKey: ['projects'] });

            queryClient.removeQueries({
                queryKey: ['project', jira_project_key],
            });

            void navigate('/');
        },
    });
};
