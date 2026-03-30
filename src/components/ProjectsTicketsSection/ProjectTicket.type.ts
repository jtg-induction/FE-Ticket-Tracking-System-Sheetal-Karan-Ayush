import { Dayjs } from "dayjs";

import { Filters } from "@components/ProjectTicketFilters";
import { TicketResponse } from "@features/ticket/createTicket/createTicket.schema";

 export type TicketSectionProps<T> = {
    filterType: 'Custom' | 'JQL';
    onFilterTypeChange: (type: 'Custom' | 'JQL') => void;
    jqlQuery: string;
    onJqlChange: (query: string) => void;
    filters: Filters;
    onFilterChange: (field: keyof Filters, value: string | Dayjs | null) => void;
    onResetFilters: () => void;
    ticketsData: T | undefined; 
    isLoading: boolean;
    isError: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    projectKey: string;
}

export type TicketPage = {
    tickets: TicketResponse[];
    next_cursor: string | null;
}
