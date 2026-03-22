import { z } from 'zod';

import { TicketPriority, TicketStatus, TicketType } from '../common';

export const ticketCreateSchema = z.object({
    title: z
        .string()
        .min(2, 'Title is required and must be at least 2 characters long.')
        .max(50, 'Title must be at most 50 characters long.'),

    description: z
        .string()
        .max(1000, 'Description can be at most 1000 characters long.'),

    ticket_type: z
        .union([
            z.literal(TicketType.BUG),
            z.literal(TicketType.FEATURE_REQUEST),
            z.literal(TicketType.TASK),
        ])
        .refine((val) => Object.values(TicketType).includes(val), {
            message: 'Please select a valid type.',
        }),

    status: z
        .union([
            z.literal(TicketStatus.OPEN),
            z.literal(TicketStatus.IN_PROGRESS),
            z.literal(TicketStatus.CLOSED),
        ])
        .refine((val) => Object.values(TicketStatus).includes(val), {
            message: 'Please select status',
        }),

    priority: z
        .union([
            z.literal(TicketPriority.LOW),
            z.literal(TicketPriority.MEDIUM),
            z.literal(TicketPriority.HIGH),
        ])
        .refine((val) => Object.values(TicketPriority).includes(val), {
            message: 'Please select priority.',
        }),

    assignee: z
        .email('Invalid email format for assignee.')
        .min(5, 'Assignee email must be at least 5 characters long.')
        .max(255, 'Assignee email must be at most 255 characters long.'),

    labels: z
        .array(z.string())
        .min(1, 'At least one label is required.')
        .max(10, 'You can assign a maximum of 10 labels.')
        .refine((labels) => labels.every((label) => label.length <= 20), {
            message: 'Each label must be at most 50 characters long.',
        }),
    project_key: z.string(),
    deadline: z.string().nullable(),
});

export const ticketResponseSchema = z.object({
    id: z.number().int(),
    title: z.string(),
    description: z.string(),
    ticket_type: z.number().int(),
    jira_ticket_key: z.string(),
    priority: z.number().int(),
    assignee: z.email(),
    reporter: z.email(),
    labels: z.array(z.string()),
    deadline: z.string().nullable(),
    created_at: z.string(),
});

export type TicketFormData = z.infer<typeof ticketCreateSchema>;
export type TicketResponse = z.infer<typeof ticketResponseSchema>;
