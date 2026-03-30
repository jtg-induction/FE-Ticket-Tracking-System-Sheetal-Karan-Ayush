import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(255, "Name length exceeds 255 charcters")
        .regex(/^[A-Za-z][A-Za-z ]+$/, "Enter a valid name (letters only)"),
    email: z.email("Enter a valid email address").max(255).trim().toLowerCase(),
    password: z.string()
        .min(8, "Password must be at least 8 characters, 1 small, 1 capital, 1 number and 1 special char")
        .max(255)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Password must contain a capital letter, small letter, number, and special character"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;
