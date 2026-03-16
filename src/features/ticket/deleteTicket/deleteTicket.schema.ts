import z from 'zod';

export const ticketDeleteRequestDataSchema = z.object({
    projectKey: z.string(),
    ticketKey: z.string(),
});

export type TicketDeleteRequest = z.infer<typeof ticketDeleteRequestDataSchema>;
