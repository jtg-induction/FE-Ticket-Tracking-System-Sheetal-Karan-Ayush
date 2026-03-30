export type TransformedStatusItem = { status: string; count: number };
export type TransformedPriorityItem = { priority: string; count: number };
export type TicketStatusCount = {
    status: number;
    count: number;
}

export type TicketPriorityCount = {
    priority: number;
    count: number;
}

export type TicketDeadlineCount = {
    day_difference: number;
    count: number;
};

export type ProjectChartsProps = {
    statusData: TicketStatusCount[] | null;
    statusLoading: boolean;
    priorityData: TicketPriorityCount[] | null;
    priorityLoading: boolean;
    deadlineData: TicketDeadlineCount[] | null;
    deadlineLoading: boolean;
};
