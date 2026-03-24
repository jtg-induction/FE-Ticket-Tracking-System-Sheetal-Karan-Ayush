import { api } from '@api';
import { handleApiError } from '@api/apiErrorHandling/handleApiError';
import { TicketUpdateFormData } from '@features/ticket/updateTicket/updateTicket.schema';

export const unSubscribeTicket = async (
    requestBody: TicketUpdateFormData,
): Promise<void> => {
    try {
        await api.post(
            `/projects/${requestBody.project_key}/tickets/${requestBody.ticket_key}/unsubscribe`,
            requestBody,
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
