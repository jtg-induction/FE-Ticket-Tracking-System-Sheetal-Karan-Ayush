import { z } from 'zod';

export const inviteUserRequestSchema = z.object({
    email: z.email('Please enter a valid email address'),
    role: z.int(),
    project_id: z.int(),
    project_key: z.string(),
});

export type InviteUserRequest = z.infer<typeof inviteUserRequestSchema>;
