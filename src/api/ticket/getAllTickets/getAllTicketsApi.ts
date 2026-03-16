import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import {
    GetAllTicketsFormData,
    GetAllTicketsResponse,
    getAllTicketsResponseSchema,
} from '@features/ticket/getAllTickets/getAllTickets.schema';

export const getAllTickets = async (
    projectKey: string,
    params: GetAllTicketsFormData,
): Promise<GetAllTicketsResponse> => {
    try {
        const response = await api.get(`/project/${projectKey}/ticket`, {
            params: params,
        });

        const parsed = getAllTicketsResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
