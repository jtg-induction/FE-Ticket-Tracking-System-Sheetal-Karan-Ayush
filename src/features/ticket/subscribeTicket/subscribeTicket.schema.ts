import z from 'zod';

export const ticketSubscribeRequestSchema = z.object({
    project_key: z.string(),
    ticket_key: z.string(),
});

export type TicketSubsribeFormData = z.infer<
    typeof ticketSubscribeRequestSchema
>;
