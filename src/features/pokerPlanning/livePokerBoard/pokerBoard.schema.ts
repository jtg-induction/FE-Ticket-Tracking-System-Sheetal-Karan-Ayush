import { boolean, z } from 'zod';


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
        event: z.literal('GET_ACTIVE_TICKET'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('ACTIVE_TICKET'),
        data: z.object({
            ticket_id: z.number().optional().nullable(),
            votes_revealed: z.boolean(),
        })
    }),

    z.object({
        event: z.literal('BROADCAST_SESSION_UPDATED'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('SESSION_UPDATED'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('BROADCAST_SESSION_DELETED'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('SESSION_DELETED'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('GET_VOTE_REVEALED_STATUS'),
        data: z.object({}),
    }),

    z.object({
        event: z.literal('VOTE_REVEALED_STATUS'),
        data: z.object({
            votes_revealed: z.boolean(),
        })
    }),

    z.object({
        event: z.literal('JOIN'),
        dta: z.object({ role: z.number() }),
    }),

    z.object({
        event: z.literal('JOINED_SUCCESSFULLY'),
        data: z.object({
            id: z.number(),
            session_id: z.number(),
            user_id: z.number(),
            user_email: z.email(),
            role: z.number(),
            is_online: boolean(),
        }),
    }),

    z.object({
        event: z.literal('SUCCESSFULLY_VOTED'),
        data: z.object({
            user_id: z.number(),
            estimate: z.number().nullable(),
            ticket_id: z.number()
        })
    }),

    z.object({
        event: z.literal('TICKET_SELECTED'),
        data: z.object({ ticket_id: z.number(), "votes_revealed": z.boolean(), })
    }),

    z.object({
        event: z.literal('SKIP_TICKET'),
        data: z.object({ ticket_id: z.number() })
    }),

    z.object({
        event: z.literal('TICKET_SKIPPED'),
        data: z.object({ ticket_id: z.number(), "votes_revealed": z.boolean(), })
    }),

    z.object({
        event: z.literal('REVEAL'),
        data: z.object({ ticket_id: z.number() })
    }),

    z.object({
        event: z.literal('VOTES_REVEALED'),
        data: z.object({
            ticket_id: z.number(),
            results: z.array(VoteDetailSchema),
            "votes_revealed": z.boolean(),
        })
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
