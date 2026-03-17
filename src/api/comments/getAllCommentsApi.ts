import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import { GetAllCommentsFormData, GetAllCommentsResponse, getAllCommentsResponseSchema } from '@features/comments/getAllComments/getAllComments.schema';

export const getAllComments = async (
    params: GetAllCommentsFormData,
): Promise<GetAllCommentsResponse> => {
    try {
        const response = await api.get(`/ticket/${params.ticket_key}/comments`, { params });

        const parsed = getAllCommentsResponseSchema.safeParse(response.data);
        
        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
