export type UserInfo = {
    id: number;
    email: string;
    name: string;
};

export type RawTicket = {
    id: number;
    title: string;
    description: string;
    ticket_type: number;
    status: number;
    jira_ticket_key: string;
    priority: number;
    deadline: string;
    assignee: string;
    reporter: string;
    created_at: string;
    labels: string[];
};

export type Ticket = {
    id: number;
    title: string;
    description: string;
    ticket_type: string;
    status: string;
    jira_ticket_key: string;
    priority: string;
    deadline: string;
    assignee: string;
    reporter: string;
    created_at: string;
    labels: string[];
};

export type Summary = {
    totalTickets: number;
    completedTickets: number;
    pendingTickets: number;
    deadlinesMet: number;
    deadlinesMissed: number;
};

export type ChartData = {
    label: string;
    value: number;
};

export type UserReportResponse = {
    user_info: UserInfo;
    summary: Summary;
    tickets: RawTicket[];
    next_cursor: string | null;
    charts: {
        deadline: ChartData[];
        priority: ChartData[];
    };
};

export type UserReportFilters = {
    status: string[];
    priority: string[];
    ticketType: string[];
    limit: number;
    sort: 'latest' | 'oldest';
    createdFrom?: string;
    createdTo?: string;
    deadlineFrom?: string;
    deadlineTo?: string;
};

export type UserBasicDetails = {
    id: number;
    email: string;
    name: string;
};
