import { Filters } from "@components/ProjectTicketFilters";
import { TicketResponse } from "@features/ticket/createTicket/createTicket.schema";

 export type TicketSectionProps = {
    filterType: 'Custom' | 'JQL';
    onFilterTypeChange: (type: 'Custom' | 'JQL') => void;
    jqlQuery: string;
    onJqlChange: (query: string) => void;
    filters: Filters;
    onFilterChange: (field: keyof Filters, value: any) => void;
    onResetFilters: () => void;
    ticketsData: TicketResponse[]; 
    isLoading: boolean;
    isError: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    projectKey: string;
}
