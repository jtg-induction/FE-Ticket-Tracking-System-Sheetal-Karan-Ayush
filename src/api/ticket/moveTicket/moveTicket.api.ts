import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import { TicketMoveFormData, TicketMoveResponse, ticketMoveResponseSchema } from '@features/ticket/moveTicket/moveTicket.schema';

export const moveTicket = async (
    data: TicketMoveFormData,
): Promise<TicketMoveResponse> => {
    try {
        const response = await api.post(
            `/project/${data.project_key}/ticket/${data.ticket_key}/move`,
            data,
        );
        const parsed = ticketMoveResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
