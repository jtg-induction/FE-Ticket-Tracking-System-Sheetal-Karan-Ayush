import z from 'zod';

export const ticketMoveRequestDataSchema = z.object({
    target_project_key: z.string(),
    project_key: z.string(),
    ticket_key: z.string(),
});

export const ticketMoveResponseSchema = z.object({
    message: z.string(),
    new_ticket_key: z.string(),
    comments_migration: z.string(),
});

export type TicketMoveResponse = z.infer<typeof ticketMoveResponseSchema>;
export type TicketMoveFormData = z.infer<typeof ticketMoveRequestDataSchema>;
