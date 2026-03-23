import { handleApiError } from '@api/apiErrorHandling/handleApiError';
import { api } from '@api/axios';
import {
    TicketResponse,
    ticketResponseSchema,
} from '@features/ticket/createTicket/createTicket.schema';
import { TicketUpdateFormData } from '@features/ticket/updateTicket/updateTicket.schema';

export const updateTicket = async (
    requestBody: TicketUpdateFormData,
): Promise<TicketResponse> => {
    try {
        const response = await api.patch(
            `/projects/${requestBody.project_key}/tickets/${requestBody.ticket_key}`,
            requestBody,
        );

        const parsed = ticketResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
