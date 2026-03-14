import { createTicket } from '@api/ticket';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TicketFormData } from './createTicket.schema';

export const useCreateTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TicketFormData) => createTicket(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });
};
