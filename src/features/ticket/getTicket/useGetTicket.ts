import { getTicket } from '@api/ticket/getTicket/getTicketApi';
import { useQuery } from '@tanstack/react-query';

import { GetTicketResponse } from '../getAllTickets/getAllTickets.schema';

export const useGetTicket = (projectKey: string, ticketKey: string) =>
    useQuery<GetTicketResponse>({
        queryKey: ['ticket', projectKey, ticketKey],
        queryFn: () => getTicket(projectKey, ticketKey),
    });
