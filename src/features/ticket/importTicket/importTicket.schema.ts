import z from "zod";

export const importTicketRequestSchema = z.object({
    ticketKey: z.string(),
    projectKey: z.string(),
});

export type TicketImportFormData = z.infer<typeof importTicketRequestSchema>;
