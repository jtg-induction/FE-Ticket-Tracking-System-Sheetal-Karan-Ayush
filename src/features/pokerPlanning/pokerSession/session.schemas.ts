import { z } from "zod";

import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from "../constants";


const TicketRequestSchema = z.object({
    id: z.number().int(),
    jira_ticket_key: z.string().optional(),
});

export const SessionCreateSchema = z.object({
    title: z.string()
        .min(TITLE_MIN_LENGTH, `Title must be at least ${TITLE_MIN_LENGTH} characters`)
        .max(TITLE_MAX_LENGTH, `Title must be under ${TITLE_MAX_LENGTH} characters`),
    description: z.string(),
    project_id: z.number().int(),
    duration: z.number().int().gt(0, "Duration must be greater than 0"),

    tickets_list: z.array(TicketRequestSchema).optional().default([]),

    scale_type: z.number().int().min(1).max(5),
    custom_scale_values: z.array(z.number().int()).optional().default([]),
}).refine((data) => {
    if (data.scale_type === 5) {
        return data.custom_scale_values.length > 0;
    }
    return true;
}, {
    message: "Add custom scale values",
    path: ["custom_scale_values"],
});

export const SessionResponseSchema = z.object({
    id: z.number().int(),
    title: z.string().min(TITLE_MIN_LENGTH)
        .max(TITLE_MAX_LENGTH),
    description: z.string(),
    project_id: z.number().int(),
    status: z.number().int().min(1).max(3).optional(),
    duration: z.number().int().gt(0),
    active_ticket_id: z.number().int().nullable().optional(),
    started_at: z.coerce.date().nullable().optional(),

    tickets_list: z.array(TicketRequestSchema).optional().default([]),
    
    scale_type: z.number().int().min(1).max(5),
    custom_scale_values: z.array(z.number().int()).optional().default([]),
    organizer_id: z.number().int().nullable().optional(),
});


export const SessionUpdateSchema = z.object({
    title: z.string()
        .min(TITLE_MIN_LENGTH)
        .max(TITLE_MAX_LENGTH)
        .optional(),
    description: z.string().optional(),
    duration: z.number().int().gt(0).optional(),
    status: z.number().int().min(1).max(3).optional(),
    active_ticket_id: z.number().int().nullable().optional(),

    tickets_list: z.array(TicketRequestSchema).optional().default([]),

    scale_type: z.number().int().min(1).max(5).optional(),
    custom_scale_values: z.array(z.number().int()).optional().default([]),
}).refine((data) => {
    if (data.scale_type === 5) {
        return data.custom_scale_values.length > 0;
    }
    return true;
}, {
    message: "Add custom scale values",
    path: ["custom_scale_values"],
});


export const TicketResponseSchema = z.object({
    id: z.number(),
    title: z.string(),
    description: z.string(),
    ticket_type: z.number(),
    status: z.number(),
    jira_ticket_key: z.string(),
    priority: z.number(),
    assignee: z.email().nullable().optional(),
    reporter: z.email().nullable().optional(),
    deadline: z.string().nullable().optional(),
    created_at: z.string(),
    labels: z.array(z.string()),
    points: z.number().nullable().optional(),
});


export type SessionUpdateType = z.infer<typeof SessionUpdateSchema>;
export type SessionCreateType = z.infer<typeof SessionCreateSchema>;
export type SessionResponseType = z.infer<typeof SessionResponseSchema>;
export type TicketResponseType = z.infer<typeof TicketResponseSchema>;
