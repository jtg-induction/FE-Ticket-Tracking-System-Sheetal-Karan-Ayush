export const TICKET_STATUS = {
    1: { label: 'Open', color: 'default' },
    2: { label: 'In Progress', color: 'info' },
    3: { label: 'Resolved', color: 'success' },
} as const;

export const TICKET_PRIORITY = {
    1: { label: 'High', color: 'error' },
    2: { label: 'Medium', color: 'warning' },
    3: { label: 'Low', color: 'success' },
} as const;

export const TICKET_TYPE = {
    1: { label: 'Task', color: 'default' },
    2: { label: 'Bug', color: 'error' },
    3: { label: 'Story', color: 'primary' },
    4: { label: 'Epic', color: 'secondary' },
    5: { label: 'Subtask', color: 'info' },
} as const;
