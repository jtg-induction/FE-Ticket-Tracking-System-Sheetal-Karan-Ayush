import { z } from 'zod';

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const ticketFiltersSchema = z.object({
    project_key: z.string(),

    assignee: z
        .array(
            z
                .email('Invalid email format for assignee.')
                .min(5, 'Assignee email must be at least 5 characters long.')
                .max(
                    255,
                    'Assignee email must be at most 255 characters long.',
                ),
        )
        .nullable(),
    status: z.array(z.number()).nullable(),
    priority: z.array(z.number()).nullable(),
    type: z.array(z.number()).nullable(),

    deadline: dateString.nullable(),

    created_start_date: dateString.nullable(),
    created_end_date: dateString.nullable(),

    completed_start_date: dateString.nullable(),
    completed_end_date: dateString.nullable(),

    group_by_user: z.boolean().nullable(),
});

export type ProjectReportFilters = z.infer<typeof ticketFiltersSchema>;
