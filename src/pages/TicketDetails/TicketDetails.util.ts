export const TicketConstToTypeMap: { [key: number]: string } = {
    1: 'Task',
    2: 'Bug',
    3: 'Story',
    4: 'Epic',
    5: 'Subtask'
};

export const TicketConstToStatusMap: { [key: number]: string } = {
    1: 'Open',
    2: 'In Progress',
    3: 'Closed',
};

export const TicketConstToPriorityMap: { [key: number]: string } = {
    1: 'High',
    2: 'Medium',
    3: 'Low',
};

export const ADMIN = 1
export const MAX_COMMENT_LENGTH = 255;

export const formatDate = (date: string) => new Date(date).toLocaleDateString();
