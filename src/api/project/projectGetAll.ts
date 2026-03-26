import { api, handleApiError } from "@api";
import { ProjectResponse } from "@features/project/schema";

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
                role: project.role
            }),
        );

        return formattedProjects;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
