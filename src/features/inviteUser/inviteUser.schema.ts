import { z } from 'zod';

export const inviteUserRequestSchema = z.object({
    email: z.email("Please enter a valid email address"),
    role: z.enum(["admin", "developer"]),
})

export type InviteUserRequest = z.infer<typeof inviteUserRequestSchema>

export type InviteUserResponse = {
    message: string;
}
