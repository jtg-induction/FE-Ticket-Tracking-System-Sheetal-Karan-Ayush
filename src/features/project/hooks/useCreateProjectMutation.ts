import { useNavigate } from 'react-router-dom';

import { createProject } from '@api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectFormData, ProjectResponse } from '../schema';
import { useProjectStore } from '../store/projectStore';

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
