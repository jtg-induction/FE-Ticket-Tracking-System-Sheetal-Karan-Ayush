import { api, handleApiError } from "@api";
import { ProjectFormData } from "@features/project";

type CheckKeyResponse = {
    valid: boolean;
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
