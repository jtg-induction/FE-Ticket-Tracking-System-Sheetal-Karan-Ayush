import { z } from 'zod';

export const projectCreateSchema = z.object({
    title: z
        .string()
        .min(2, 'Title must be at least 2 characters')
        .max(100, 'Title must be at most 100 characters')
        .regex(/\S/, 'Title cannot be blank'),

    description: z
        .string()
        .max(500, 'Description must be at most 500 characters')
        .optional(),

    jira_url: z
        .url('Invalid JIRA URL')
        .refine((val) => val.startsWith('https://'), 'JIRA URL must use HTTPS')
        .refine(
            (val) => val.includes('.atlassian.net') || val.includes('.jira.'),
            'Must be a valid Atlassian/JIRA domain',
        ),

    access_token: z
        .string()
        .min(10, 'Access token must be at least 10 characters')
        .max(256, 'Access token is too long'),

    lead_email: z
        .email('Invalid email')
        .refine(
            (val) => !val.endsWith('@example.com'),
            'Please use a real email address',
        ),

    jira_project_key: z
        .string()
        .min(2, 'Minimum 2 letters')
        .max(10, 'Maximum 10 letters')
        .regex(/^[A-Z]+$/, 'Only uppercase letters allowed'),

    status: z.number().int().min(0).max(10).optional(),
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
