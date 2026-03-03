import { api, handleApiError } from '@api';

import { projectCreateSchema, ProjectFormData } from './schema';

type CheckKeyResponse = {
    valid: boolean;
};

export const createProject = async (
    data: ProjectFormData,
): Promise<ProjectFormData> => {
    try {
        const parseResult = projectCreateSchema.safeParse(data);
        if (!parseResult.success) {
            throw new Error('Invalid project data');
        }

        const response = await api.post('/projects', data);

        const parsed = projectCreateSchema.safeParse(response.data);
        if (!parsed.success) {
            throw new Error('Invalid server response');
        }

        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

export const checkProjectKey = async (
    key: string,
    formData: Pick<ProjectFormData, 'jira_url' | 'access_token' | 'lead_email'>,
): Promise<CheckKeyResponse> => {
    try {
        const response = await api.post<CheckKeyResponse>(
            `/projects/validate-key?key=${key}`,
            {
                jira_url: formData.jira_url,
                access_token: formData.access_token,
                lead_email: formData.lead_email,
            },
        );

        if (
            typeof response.data !== 'object' ||
            typeof response.data.valid !== 'boolean'
        ) {
            throw new Error('Invalid server response');
        }

        return response.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

export const updateProject = async (
    projectId: string,
    data: ProjectFormData,
): Promise<ProjectFormData> => {
    try {
        const parseResult = projectSchema.safeParse(data);
        if (!parseResult.success) {
            throw new Error('Invalid project data');
        }

        const response = await api.put(`/projects/${projectId}`, data);

        const parsed = projectSchema.safeParse(response.data);
        if (!parsed.success) {
            throw new Error('Invalid server response');
        }

        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

export const deleteProject = async (projectId: string): Promise<void> => {
    try {
        await api.delete(`/projects/${projectId}`);
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
