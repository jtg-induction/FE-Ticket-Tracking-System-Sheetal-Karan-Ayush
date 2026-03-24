import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';

import {
    getAllProjectUsersResponseSchema,
    GetAllUsersRequest,
    GetAllUsersResponse,
    projectCreateSchema,
    ProjectFormData,
    ProjectResponse,
    ProjectUpdateData,
    projectUpdateSchema,
} from './schema';

type CheckKeyResponse = {
    valid: boolean;
};

export type DeadlineStatsResponse = {
    day_difference: number;
    count: number;
};
export interface TicketStatusCount {
    status: string;
    count: number;
}

export interface TicketPriorityCount {
    priority: string;
    count: number;
}
export const createProject = async (
    data: ProjectFormData,
): Promise<ProjectResponse> => {
    try {
        const parseResult = projectCreateSchema.safeParse(data);
        if (!parseResult.success) {
            throw new Error('Invalid project data');
        }

        const response = await api.post('/projects', data);

        const project = response.data as ProjectResponse;

        const formattedProject: ProjectResponse = {
            id: project.id,
            title: project.title,
            description: project.description || '',
            jira_project_key: project.jira_project_key.toUpperCase(),
            jira_url: `${project.jira_url.replace(/\/$/, '')}/browse/${project.jira_project_key}`,
            status: 1,
            role: 1,
        };

        return formattedProject;
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
    projectKey: string,
    data: ProjectUpdateData,
): Promise<ProjectResponse> => {
    try {
        const parseResult = projectUpdateSchema.safeParse(data);
        if (!parseResult.success) {
            throw new Error('Invalid project data');
        }

        const response = await api.patch(`/projects/${projectKey}`, data);

        const project = response.data as ProjectResponse;

        const formattedProject: ProjectResponse = {
            id: project.id,
            title: project.title,
            description: project.description || '',
            jira_project_key: project.jira_project_key.toUpperCase(),
            jira_url: `${project.jira_url.replace(/\/$/, '')}/browse/${project.jira_project_key}`,
            status: 1,
            role: 1,
        };

        return formattedProject;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

export const deleteProject = async (projectKey: string): Promise<void> => {
    try {
        await api.delete(`/projects/`, {
            params: { project_key: projectKey },
        });
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

export const getAllProjects = async (): Promise<ProjectResponse[]> => {
    try {
        const response = await api.get<ProjectResponse[]>('/projects');

        const projects = response.data;

        const formattedProjects: ProjectResponse[] = projects.map(
            (project) => ({
                id: project.id,
                title: project.title,
                description: project.description || '',
                jira_project_key: project.jira_project_key.toUpperCase(),
                jira_url: `${project.jira_url.replace(/\/$/, '')}/browse/${project.jira_project_key}`,
                status: project.status ?? 1,
                role: project.role,
            }),
        );

        return formattedProjects;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};

export const getProject = async (
    projectKey: string,
): Promise<ProjectResponse> => {
    try {
        const response = await api.get<ProjectResponse>(
            `/projects/${projectKey}`,
        );

        const project = response.data;

        const formattedProject: ProjectResponse = {
            id: project.id,
            title: project.title,
            description: project.description || '',
            jira_project_key: project.jira_project_key.toUpperCase(),
            jira_url: `${project.jira_url.replace(/\/$/, '')}/browse/${project.jira_project_key}`,
            status: project.status,
            role: project.role,
        };

        return formattedProject;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};


export const getTicketDeadlineStats = async (
    projectKey: string,
): Promise<DeadlineStatsResponse[]> => {
    const response = await api.get<DeadlineStatsResponse[]>(
        `api/reports/project/${projectKey}/ticket/deadline`,
    );
    return response.data;
};

export const getTicketStatusStats = async (
    projectKey: string,
): Promise<TicketStatusCount[]> => {
    const response = await api.get<TicketStatusCount[]>(
        `api/reports/project/${projectKey}/ticket/status`,
    );
    return response.data;
};

export const getTicketPriorityStats = async (
    projectKey: string,
): Promise<TicketPriorityCount[]> => {
    const response = await api.get<TicketPriorityCount[]>(
        `api/reports/project/${projectKey}/ticket/priority`,
    );
    return response.data;
}

export const getAllUsers =  async (
    data: GetAllUsersRequest,
): Promise<GetAllUsersResponse> => {
    try {
        const response = await api.get<ProjectResponse>(
            `/projects/${data.projectKey}/users`, {
                params: { user_name: data.userName, offset: data.offset, limit: data.limit },
            }
        );

        const parsed = getAllProjectUsersResponseSchema.safeParse(response.data);
        
        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;

    } catch (error: unknown) {
        return handleApiError(error);
    }
};
