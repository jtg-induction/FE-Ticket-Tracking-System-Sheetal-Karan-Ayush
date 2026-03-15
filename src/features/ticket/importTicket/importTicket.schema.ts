import z from "zod";

export const importTicketRequestSchema = z.object({
    ticketKey: z.string()
                .min(2, 'ticketKey must be at least 2 characters long.')
                .max(50, 'Title must be at most 10 characters long.'),
    projectKey: z.string(),
});

export type TicketImportFormData = z.infer<typeof importTicketRequestSchema>;
