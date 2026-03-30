import { z } from 'zod';

export const loginSchema = z.object({
    email: z.email("Enter a valid email address").max(255).trim().toLowerCase(),
    password: z.string()
        .min(8, "Password must be at least 8 characters, 1 small, 1 capital, 1 number and 1 special char")
        .max(255)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Password must contain a capital letter, small letter, number, and special character"),
});

export type LoginInput = z.infer<typeof loginSchema>;
