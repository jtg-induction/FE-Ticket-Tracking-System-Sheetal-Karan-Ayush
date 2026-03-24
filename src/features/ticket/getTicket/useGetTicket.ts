import { getTicket } from '@api/ticket/getTicket/getTicketApi';
import { useQuery } from '@tanstack/react-query';

import { GetTicketDetailsResponse } from '../getAllTickets/getAllTickets.schema';

export const useGetTicket = (projectKey: string, ticketKey: string) =>
    useQuery<GetTicketDetailsResponse>({
        queryKey: ['ticket', projectKey, ticketKey],
        queryFn: () => getTicket(projectKey, ticketKey),
    });
