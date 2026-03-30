import { z } from 'zod';

export const updateRoleRequestSchema = z.object({
    user_id: z.int(),
    project_key: z.string()
});

export type UpdateRoleFormData = z.infer<typeof updateRoleRequestSchema>;
