import { checkProjectKey } from '@api';
import { useMutation } from '@tanstack/react-query';

import { ProjectFormData } from '../schema';

type CheckKeyVariables = {
    key: string;
    formData: Pick<ProjectFormData, 'jira_url' | 'access_token' | 'lead_email'>;
};

type CheckKeyResponse = { valid: boolean };

export const useCheckProjectKey = () =>
    useMutation<CheckKeyResponse, Error, CheckKeyVariables>({
        mutationFn: async ({ key, formData }) => checkProjectKey(key, formData),
    });
