import { z } from 'zod';

export const authResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    access_token: z.string(),
    refresh_token: z.string(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
