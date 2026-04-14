export type LocationState = {
    projectId: number;
    projectKey: string;
    isDeveloper?: boolean;
}

export type Ticket = {
    id: number;
    title: string;
    jira_ticket_key: string;
    description?: string;
    priority?: number;
    ticket_type?: number;
    status?: number;
    assignee?: string;
    points?: number;
}
