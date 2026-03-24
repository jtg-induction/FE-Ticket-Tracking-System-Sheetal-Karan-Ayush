import { useNavigate } from 'react-router-dom';

import { deleteTicket } from '@api/ticket/deleteTicket.Api.ts/deleteTicketApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TicketDeleteRequest } from './deleteTicket.schema';

export const useDeleteTicket = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ projectKey, ticketKey }: TicketDeleteRequest) =>
            deleteTicket({ projectKey, ticketKey }),
        onSuccess: async (_data, payload) => {
            await queryClient.invalidateQueries({ queryKey: ['tickets'] });
            void navigate(`/project/${payload.projectKey}`);
        },
    });
};
