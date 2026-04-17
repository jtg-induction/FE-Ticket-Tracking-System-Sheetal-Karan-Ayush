import { z } from 'zod';


export const ParticipantSchema = z.object({
    user_id: z.number(),
    name: z.string(),
    role: z.number(),
    is_online: z.boolean(),
    estimate: z.number().nullable().optional(),
});

export const VoteDetailSchema = z.object({
    user_id: z.number(),
    user_name: z.string(),
    ticket_id: z.number(),
    estimated_points: z.number(),
});

export const PokerEventSchema = z.discriminatedUnion('event', [

    z.object({
        event: z.literal('PARTICIPANTS_LIST'),
        data: z.array(ParticipantSchema)
    }),

    z.object({
        event: z.literal('ACTIVE_TICKET'),
        data: z.number().optional().nullable(),
    }),

    // z.object({
    //     event: z.literal('LEAVE'),
    //     data: z.object({}),
    // }),

    z.object({
        event: z.literal('SUCCESSFULLY_VOTED'),
        data: z.object({
            user_id: z.number(),
            estimate: z.number().nullable(),
            ticket_id: z.number()
        })
    }),

    z.object({
        event: z.literal('VOTES_REVEALED'),
        data: z.object({
            ticket_id: z.number(),
            results: z.array(VoteDetailSchema),
        })
    }),

    z.object({
        event: z.literal('TICKET_SELECTED'),
        data: z.object({ ticket_id: z.number() })
    }),

    z.object({
        event: z.literal('SKIP_TICKET'),
        data: z.object({ ticket_id: z.number() })
    }),

    z.object({
        event: z.literal('TICKET_SKIPPED'),
        data: z.object({ ticket_id: z.number() })
    }),

    z.object({
        event: z.literal('REVEAL'),
        data: z.object({ ticket_id: z.number() })
    }),

    z.object({
        event: z.literal('FINAL_ESTIMATE_TICKET'),
        data: z.object({
            ticket_id: z.number(),
            estimate: z.number().int()
        })
    }),

    z.object({
        event: z.literal('STARTED'),
        data: z.object({
            session_id: z.number(),
            duration: z.number(),
            started_at: z.string(),
            scale_type: z.number(),
            allowed_values: z.array(z.number())
        })
    }),

    z.object({
        event: z.literal('SUCCESS'),
        data: z.object({ ticket_id: z.number(), estimate: z.number() })
    }),

    z.object({
        event: z.literal('ERROR'),
        data: z.string()
    }),

    z.object({
        event: z.literal('START'),
        data: z.object({ duration: z.number().int().nullish() })
    }),

    z.object({
        event: z.literal('END'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('GET_PARTICIPANTS_LIST'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('GET_REMAINING_TIME'),
        data: z.object({ session_id: z.number() })
    }),
    z.object({
        event: z.literal('VOTE'),
        data: z.object({ ticket_id: z.number(), estimate: z.number().int() })
    }),
    z.object({
        event: z.literal('REMAINING_TIME'),
        data: z.object({ remaining_seconds: z.number(), total_duration: z.number() })
    }),
    z.object({
        event: z.literal('SELECT_TICKET'),
        data: z.object({ ticket_id: z.number() })
    }),
    z.object({
        event: z.literal('ENDED'),
        data: z.object({ message: z.string() })
    }),
]);


export type PokerEvent = z.infer<typeof PokerEventSchema>;
export type ParticipantType = z.infer<typeof ParticipantSchema>;
