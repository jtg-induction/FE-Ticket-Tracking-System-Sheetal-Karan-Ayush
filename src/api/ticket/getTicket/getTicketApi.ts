import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import {
    GetTicketResponse,
    ticketsResponseSchema,
} from '@features/ticket/getAllTickets/getAllTickets.schema';

export const getTicket = async (
    projectKey: string,
    ticketKey: string,
): Promise<GetTicketResponse> => {
    try {
        const response = await api.get(
            `/projects/${projectKey}/tickets/${ticketKey}`,
        );

        const parsed = ticketsResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
