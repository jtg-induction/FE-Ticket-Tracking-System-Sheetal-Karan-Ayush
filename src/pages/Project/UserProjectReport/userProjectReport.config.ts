import { RawTicket, Ticket } from './UserProjectReport.type';

export const STATUS_MAP: Record<string, number> = {
    Open: 1,
    In_Progress: 2,
    Resolved: 3,
};

export const PRIORITY_MAP: Record<string, number> = {
    Low: 3,
    Medium: 2,
    High: 1,
};

export const TICKET_TYPE_MAP: Record<string, number> = {
    Task: 1,
    Bug: 2,
    Story: 3,
    Epic: 4,
    Subtask: 5,
};


export const STATUS_INT_TO_STRING: Record<number, string> = {
    1: 'Open',
    2: 'In Progress',
    3: 'Resolved',
    4: 'Deleted',
};

export const PRIORITY_INT_TO_STRING: Record<number, string> = {
    1: 'High',
    2: 'Medium',
    3: 'Low',
};

export const TYPE_INT_TO_STRING: Record<number, string> = {
    1: 'Task',
    2: 'Bug',
    3: 'Story',
    4: 'Epic',
    5: 'Sub Task',
};

export const mapTicket = (ticket: RawTicket): Ticket => ({
    ...ticket,
    status: STATUS_INT_TO_STRING[ticket.status] ?? String(ticket.status),
    priority:
        PRIORITY_INT_TO_STRING[ticket.priority] ?? String(ticket.priority),
    ticket_type:
        TYPE_INT_TO_STRING[ticket.ticket_type] ?? String(ticket.ticket_type),
});
