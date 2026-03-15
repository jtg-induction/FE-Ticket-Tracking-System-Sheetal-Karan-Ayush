import { z } from 'zod';

export const getAllTicketsRequestSchema = z.object({
    title: z.string().min(2).max(100).optional(),

    assignee: z.email().optional(),

    status: z.number().int().optional(),

    priority: z.number().int().optional(),

    ticket_type: z.number().int().optional(),

    deadline: z.string().optional(),

    sort: z.string().optional().default('latest'),

    cursor: z.string().optional(),

    limit: z.number().int().min(1).max(100).default(20),
});

export const ticketsResponseSchema = z.object({
    id: z.int().nullable(),
    title: z.string(),
    description: z.string(),
    ticket_type: z.number().int(),
    status: z.number().int(),
    jira_ticket_key: z.string(),
    priority: z.number().int(),
    assignee: z.email(),
    reporter: z.email(),
    deadline: z.string().nullable(),
    created_at: z.string(),
    labels: z.array(z.string()),
});

export const getAllTicketsJqlRequestSchema = z.object({
    jql: z.string(),
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(20),
});

export const getAllTicketsResponseSchema = z.object({
    tickets: z.array(ticketsResponseSchema),
    next_cursor: z.string().nullable()
});

export type GetTicketResponse = z.infer<typeof ticketsResponseSchema>;
export type GetAllTicketsFormData = z.infer<typeof getAllTicketsRequestSchema>;
export type GetAllTicketsResponse = z.infer<typeof getAllTicketsResponseSchema>;
export type GetAllTicketsJqlFormData =  z.infer<typeof getAllTicketsJqlRequestSchema>;
export type QueryParams = Omit<GetAllTicketsFormData, 'cursor'>;
export type JqlQueryParams = Omit<GetAllTicketsJqlFormData, 'cursor'>;
