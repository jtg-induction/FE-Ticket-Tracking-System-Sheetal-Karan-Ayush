import { api, handleApiError } from "@api";
import { ProjectResponse, ProjectUpdateData, projectUpdateSchema } from "@features/project/schema";

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
            role: project.role
        };

        return formattedProject;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
