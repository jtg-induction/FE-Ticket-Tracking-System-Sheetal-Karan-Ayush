import { unSubscribeTicket } from '@api/ticket/subscribeTicket/unSubscribeTicketApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TicketSubsribeFormData } from './subscribeTicket.schema';


export const useUnSubscribeTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TicketSubsribeFormData) => unSubscribeTicket(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticket'] });
        },
    });
}
