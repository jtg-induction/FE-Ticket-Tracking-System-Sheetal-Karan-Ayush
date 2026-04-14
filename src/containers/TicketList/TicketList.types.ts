import { TicketResponseType } from "@features/pokerPlanning/createSession/session.schemas";

export type TicketListProps = {
    tickets: TicketResponseType[];
    isOrganizer?: boolean;
    onActivate?: (ticketId: number) => void;
    activeTicketId?: number | null;
    showControls?: boolean;
    resolvedTickets?: { ticket_id: number; estimate: number }[];
    heading?: string;
    defaultExpanded?: boolean;
}
