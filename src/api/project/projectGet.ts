import { api, handleApiError } from "@api";
import { ProjectResponse } from "@features/project/schema";

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
            role: project.role
        };

        return formattedProject;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
