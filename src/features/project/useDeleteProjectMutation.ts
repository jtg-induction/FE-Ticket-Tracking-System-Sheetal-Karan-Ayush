import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteProject } from './api'; 
export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']); 
        },
    });
};
