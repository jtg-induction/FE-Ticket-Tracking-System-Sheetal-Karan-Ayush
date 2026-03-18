import { moveTicket } from '@api/ticket/moveTicket/moveTicket.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TicketMoveFormData } from './moveTicket.schema';

export const useMoveTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TicketMoveFormData) => moveTicket(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });
};
