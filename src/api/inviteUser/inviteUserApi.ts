import { api } from '@api';
import { handleApiError } from '@api/apiErrorHandling';
import {
    type InviteUserRequest,
    type InviteUserResponse,
} from '@features/inviteUser';

/**
 * Sends an API request to invite a user to a project.
 *
 * This function takes the request data for inviting a user, sends it to the backend API (`/api/project/invite`),
 * and returns the response. If the request is successful, it returns the server's response as an `InviteUserResponse` object.
 * If an error occurs during the API request, the error is handled by the `handleApiError` function.
 *
 * @param data - An object containing the necessary data to invite a user. This is of type `InviteUserRequest`, which includes
 *               fields like the user's email, project ID, and role.
 * @returns A promise that resolves to an `InviteUserResponse` object, which contains the response data from the server.
 * @throws Will throw an error if the API request fails or if the server responds with an error.
 */
export const inviteUserApi = async (
    data: InviteUserRequest,
): Promise<InviteUserResponse> => {
    try {
        const response = await api.post<InviteUserResponse>(
            '/projects/invite',
            data,
        );
        return response.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
