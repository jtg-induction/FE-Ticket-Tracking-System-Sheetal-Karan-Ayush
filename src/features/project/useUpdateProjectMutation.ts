import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateProject } from './api'; // Import API method
import { ProjectFormData } from './schema';

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ProjectFormData }) =>
            updateProject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        }
    });
};
