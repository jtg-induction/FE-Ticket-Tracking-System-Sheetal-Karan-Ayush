import { subscribeTicket } from '@api/ticket/subscribeTicket/subscribeTicketApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TicketSubsribeFormData } from './subscribeTicket.schema';

export const useSubscribeTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TicketSubsribeFormData) => subscribeTicket(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticket'] });
        },
    });
};
