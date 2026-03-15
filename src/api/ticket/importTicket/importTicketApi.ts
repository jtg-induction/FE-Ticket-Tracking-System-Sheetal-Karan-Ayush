import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import {
    GetTicketResponse,
    ticketsResponseSchema,
} from '@features/ticket/getAllTickets/getAllTickets.schema';
import { TicketImportFormData } from '@features/ticket/importTicket/importTicket.schema';

export const importTicket = async (
    data: TicketImportFormData,
): Promise<GetTicketResponse> => {
    try {
        const response = await api.post(
            `project/${data.projectKey}/ticket/${data.ticketKey}`,
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
