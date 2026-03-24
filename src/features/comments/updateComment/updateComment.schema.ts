import z from 'zod';

export const commentUpdateSchema = z.object({
    content: z
        .string()
        .min(1, 'comment is required')
        .max(255, 'comment must be at most 255 characters long.'),
    comment_id: z.int(),
    ticket_key: z.string(),
    ticket_id: z.int(),
});

export type UpdateCommentFormData = z.infer<typeof commentUpdateSchema>;
export type DeleteCommentFormData = Omit<
    UpdateCommentFormData,
    'content' | 'ticket_id'
>;
