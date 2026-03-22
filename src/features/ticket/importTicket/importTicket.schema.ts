import z from "zod";

export const importTicketRequestSchema = z.object({
    ticketKey: z.array(
                    z.string()
                        .min(2, "Ticket key must be at least 2 characters long.")
                        .max(10, "Ticket key must be at most 10 characters long.")
                )
                .min(1, "At least one ticket key is required")
                .max(10, "At max 10 ticket keys can be provided"),
    projectKey: z.string(),
});

export type TicketImportFormData = z.infer<typeof importTicketRequestSchema>;
