import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import { TicketDeleteRequest } from '@features/ticket/deleteTicket/deleteTicket.schema';

export const deleteTicket = async (
    data: TicketDeleteRequest,
): Promise<void> => {
    try {
        await api.delete(
            `/project/${data.projectKey}/ticket/${data.ticketKey}`,
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
