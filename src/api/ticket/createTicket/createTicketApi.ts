import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import {
    TicketFormData,
    TicketResponse,
    ticketResponseSchema,
} from '@features/ticket/createTicket/createTicket.schema';

export const createTicket = async (
    data: TicketFormData,
): Promise<TicketResponse> => {
    try {
        const response = await api.post(
            `/project/${data.project_key}/ticket`,
            data,
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
