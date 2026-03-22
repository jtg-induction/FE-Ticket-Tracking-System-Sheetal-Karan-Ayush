import { z } from 'zod';

import { TicketPriority, TicketStatus, TicketType } from '../common';

export const ticketUpdateRequestSchema = z.object({
    title: z
        .string()
        .min(2, 'Title must be at least 2 characters long.')
        .max(50, 'Title must be at most 50 characters long.')
        .optional(),
    description: z
        .string()
        .min(0)
        .max(1000, 'Description can be at most 1000 characters long.')
        .optional(),
    ticket_type: z
        .union([
            z.literal(TicketType.BUG),
            z.literal(TicketType.FEATURE_REQUEST),
            z.literal(TicketType.TASK),
        ])
        .optional(),
    status: z
        .union([
            z.literal(TicketStatus.OPEN),
            z.literal(TicketStatus.IN_PROGRESS),
            z.literal(TicketStatus.CLOSED),
        ])
        .optional(),
    priority: z
        .union([
            z.literal(TicketPriority.LOW),
            z.literal(TicketPriority.MEDIUM),
            z.literal(TicketPriority.HIGH),
        ])
        .optional(),
    assignee: z
        .email('Invalid email format for assignee.')
        .min(5, 'Assignee email must be at least 5 characters long.')
        .max(255, 'Assignee email must be at most 255 characters long.')
        .optional(),
    labels: z
        .array(z.string())
        .min(1, 'At least one label is required.')
        .max(10, 'You can assign a maximum of 10 labels.')
        .refine((labels) => labels.every((label) => label.length <= 20), {
            message: 'Each label can be at most 20 characters long.',
        })
        .optional(),
    deadline: z.string().optional(),
    project_key: z.string(),
    ticket_key: z.string(),
});

export type TicketUpdateFormData = z.infer<typeof ticketUpdateRequestSchema>;
