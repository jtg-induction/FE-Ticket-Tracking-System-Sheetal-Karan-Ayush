import {
    type InviteUserRequest,
    type InviteUserResponse,
} from '@features/inviteUser';

import { api } from './axios';
import { handleApiError } from './handleApiError';

export const inviteUserApi = async (
    data: InviteUserRequest,
): Promise<InviteUserResponse> => {
    try {
        const response = await api.post<InviteUserResponse>(
            '/api/project/invite',
            data,
        );
        return response.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
