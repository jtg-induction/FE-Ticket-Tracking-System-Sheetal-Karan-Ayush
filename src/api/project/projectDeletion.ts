import { api, handleApiError } from "@api";

export const deleteProject = async (projectKey: string): Promise<void> => {
    try {
        await api.delete(`/projects/${projectKey}`);
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
