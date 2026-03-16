import { updateTicket } from '@api/ticket/updateTicket/updateTicketApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TicketUpdateFormData } from './updateTicket.schema';


export const useUpdateTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TicketUpdateFormData) => updateTicket(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['ticket'] });
        },
    });
};
