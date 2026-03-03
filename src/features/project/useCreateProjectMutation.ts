import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProject } from './api';
import { ProjectFormData } from './schema';

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProjectFormData) => createProject(data),
        onSuccess: () => queryClient.invalidateQueries(['projects']),
    });
};
