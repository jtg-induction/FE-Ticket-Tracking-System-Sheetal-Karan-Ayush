import { z } from 'zod';

export const getAllCommentsRequestSchema = z.object({
    limit: z.int(),
    cursor: z.string().optional(),
    ticket_key: z.string(),
    parent_comment_id: z.int().nullable(),
});

export const allCommentsResponseSchema = z.object({
    id: z.int(),
    comment: z.string(),
    user_id: z.int(),
    ticket_id: z.int(),
    parent_comment_id: z.int().nullable(),
    created_at: z.string(),
    email: z.string(),
});
export const getAllCommentsResponseSchema = z.object({
    comments: z.array(allCommentsResponseSchema),
    next_cursor: z.string().nullable(),
});

export type GetAllCommentsFormData = z.infer<
    typeof getAllCommentsRequestSchema
>;
export type GetAllCommentsResponse = z.infer<
    typeof getAllCommentsResponseSchema
>;
