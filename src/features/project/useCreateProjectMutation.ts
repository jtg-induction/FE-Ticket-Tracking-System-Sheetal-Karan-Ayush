import { useNavigate } from 'react-router-dom';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createProject } from './api';
import { useProjectStore } from './projectStore';
import { ProjectFormData, ProjectResponse } from './schema';

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: (data: ProjectFormData) => createProject(data),
        onSuccess: async (newProject: ProjectResponse) => {
            await queryClient.invalidateQueries({ queryKey: ['projects'] });
            useProjectStore.getState().setProject(newProject);
            void navigate(`/project/${newProject.id}`);
        },
    });
};
