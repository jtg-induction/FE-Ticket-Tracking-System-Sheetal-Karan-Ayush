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

export type ProjectResponse = {
    id: string;
    title: string;
    description: string;
    jira_project_key: string;
    jira_url: string;
    status: number;
    role: number;
};

export type ProjectFormData = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateData = z.infer<typeof projectUpdateSchema>;
