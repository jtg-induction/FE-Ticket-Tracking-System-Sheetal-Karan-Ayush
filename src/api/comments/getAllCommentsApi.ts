import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import { GetAllCommentsFormData, GetAllCommentsResponse, getAllCommentsResponseSchema } from '@features/comments/getAllComments/getAllComments.schema';

/**
 * Fetches all comments for a given ticket.
 *
 * This function sends a GET request to retrieve comments associated
 * with a specific ticket. The response is validated using a Zod schema
 * to ensure type safety before being returned.
 *
 * @param params - Query parameters required to fetch comments, including:
 * - `ticket_key`: Unique identifier of the ticket
 * - Any additional query params (e.g., pagination, filters)
 *
 * @returns A promise that resolves to a validated {@link GetAllCommentsResponse}
 *
 * @throws Will throw an error if:
 * - The API response does not match the expected schema
 * - The API request fails (handled via {@link handleApiError})
 */
export const getAllComments = async (
    params: GetAllCommentsFormData,
): Promise<GetAllCommentsResponse> => {
    try {
        const response = await api.get(`/api/tickets/${params.ticket_key}/comments`, { params });
        const parsed = getAllCommentsResponseSchema.safeParse(response.data);
        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;

    } catch (error: unknown) {
        return handleApiError(error);
    }
};
