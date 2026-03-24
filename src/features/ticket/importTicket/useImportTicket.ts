import { importTicket } from '@api/ticket/importTicket/importTicketApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TicketImportFormData } from './importTicket.schema';

export const useImportTicketMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TicketImportFormData) => importTicket(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
    });
};
