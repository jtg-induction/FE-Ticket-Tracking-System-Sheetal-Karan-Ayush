import { api, handleApiError } from "@api";
import { ProjectFormData } from "@features/project";
import { projectCreateSchema, ProjectResponse } from "@features/project/schema";

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
            role: project.role
        };

        return formattedProject;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
