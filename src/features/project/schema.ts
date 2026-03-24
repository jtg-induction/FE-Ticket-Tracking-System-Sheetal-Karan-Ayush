import { z } from 'zod';

export const projectCreateSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    jira_url: z.string().url('Invalid JIRA URL'),
    access_token: z.string().min(1, 'Access token required'),
    lead_email: z.string().email('Invalid email'),
    jira_project_key: z
        .string()
        .min(2, 'Minimum 2 letters')
        .max(10, 'Maximum 10 letters')
        .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
    status: z.number().optional(),
});

export const projectUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    access_token: z.string().optional(),
    status: z.number().optional(),
});

export const getAllProjectUsersRequestSchema = z.object({
    projectKey: z.string(),
    userName: z.string().optional(),
    offset: z.int().optional(),
    limit: z.int().optional(),
});

export const projectUserSchema = z.object({
  user_id: z.number(),
  user_name: z.string(),
  user_email: z.email(),
  role: z.string(),
  joined_at: z.string().nullable(),
});

export const getAllProjectUsersResponseSchema = z.array(projectUserSchema);

export type ProjectResponse = {
    id: number;
    title: string;
    description: string;
    jira_project_key: string;
    jira_url: string;
    status: number;
    role: number;
};

export type ProjectFormData = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateData = z.infer<typeof projectUpdateSchema>;
export type GetAllUsersRequest = z.infer<typeof getAllProjectUsersRequestSchema>;
export type GetAllUsersResponse = z.infer<typeof getAllProjectUsersResponseSchema>;
