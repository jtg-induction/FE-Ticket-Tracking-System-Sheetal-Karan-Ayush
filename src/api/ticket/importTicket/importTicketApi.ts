import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import {
    GetTicketImportResponse,
    ticketsImportResponseSchema,
} from '@features/ticket/getAllTickets/getAllTickets.schema';
import { TicketImportFormData } from '@features/ticket/importTicket/importTicket.schema';

export const importTicket = async (
    data: TicketImportFormData,
): Promise<GetTicketImportResponse> => {
    try {
        const response = await api.post(
            `projects/${data.projectKey}/import`, {
                ticket_keys: data.ticketKey
            }
        );

        const parsed = ticketsImportResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
