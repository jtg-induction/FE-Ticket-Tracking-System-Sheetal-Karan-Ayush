import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import {
    GetAllTicketsJqlFormData,
    GetAllTicketsResponse,
    getAllTicketsResponseSchema,
} from '@features/ticket/getAllTickets/getAllTickets.schema';

export const getAllTicketsJql = async (
    projectKey: string,
    params: GetAllTicketsJqlFormData,
): Promise<GetAllTicketsResponse> => {
    try {
        const response = await api.post(
            `/projects/${projectKey}/search`,
            { jql: params.jql },
            {
                params: { limit: params.limit, cursor: params.cursor },
            },
        );
        const parsed = getAllTicketsResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
