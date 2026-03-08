import { z } from 'zod';

export const authResponseSchema = z.object({
    id: z.int(),
    name: z.string(),
    email: z.string(),
    avatar_id: z.int(),
    access_token: z.string(),
    refresh_token: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
