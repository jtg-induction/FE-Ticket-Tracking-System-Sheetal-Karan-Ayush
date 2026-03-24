import { z } from 'zod';

export const commentCreateSchema = z.object({
    content: z
        .string()
        .min(1, 'comment is required')
        .max(255, 'comment must be at most 255 characters long.'),
    project_key: z.string(),
    ticket_key: z.string(),
    parent_comment_id: z.int().nullable(),
});

export const commentResponseSchema = z.object({
    id: z.int(),
    comment: z.string(),
    user_id: z.int(),
    ticket_id: z.int(),
    parent_comment_id: z.int().nullable(),
});

export type CreateCommentFormData = z.infer<typeof commentCreateSchema>;
export type CommentResponse = z.infer<typeof commentResponseSchema>;
