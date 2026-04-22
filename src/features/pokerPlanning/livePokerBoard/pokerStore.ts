import { create } from 'zustand';

import { ParticipantType, PokerEvent } from './pokerBoard.schema';

interface PokerBoardState {
    participants: ParticipantType[];
    activeTicketId: number | null;
    isRevealed: boolean;
    timeLeft: number | null;
    resolvedTickets: { ticket_id: number; estimate: number }[];
    updateFromEvent: (message: PokerEvent, currentUserId?: number) => void;
}

export const usePokerBoardStore = create<PokerBoardState>((set) => ({
    participants: [],
    activeTicketId: null,
    isRevealed: false,
    timeLeft: null,
    resolvedTickets: [],

    updateFromEvent: (message, currentUserId) => {
        switch (message.event) {
            case 'PARTICIPANTS_LIST':
                set({ participants: message.data });
                break;

            case 'ACTIVE_TICKET':
                set({ activeTicketId: message.data.ticket_id, isRevealed: message.data.votes_revealed });
                break;

            case 'VOTE_REVEALED_STATUS':
                set({ isRevealed: message.data.votes_revealed });
                break;

            case 'JOINED_SUCCESSFULLY':
                set((state) => ({
                    participants: state.participants.map((p) =>
                        p.user_id === message.data.user_id
                            ? { ...p, role: message.data.role, is_online: true }
                            : p
                    ),
                }));
                break;

            case 'TICKET_SELECTED':
                set((state) => ({
                    activeTicketId: message.data.ticket_id,
                    isRevealed: message.data.votes_revealed,
                    participants: state.participants.map((p) => ({
                        ...p,
                        estimate: undefined
                    }))
                }));
                break;

            case 'VOTE':
                set((state) => ({
                    participants: state.participants.map((p) =>
                        p.user_id === currentUserId
                            ? { ...p, estimate: message.data.estimate }
                            : p
                    ),
                }));
                break;

            case 'SUCCESSFULLY_VOTED':
                set((state) => ({
                    isRevealed: false,
                    participants: state.participants.map((p) =>
                        p.user_id === message.data.user_id
                            ? { ...p, estimate: message.data.estimate }
                            : p
                    ),
                }));
                break;

            case 'VOTES_REVEALED':
                set((state) => ({
                    isRevealed: true,
                    activeTicketId: message.data.ticket_id,
                    participants: state.participants.map((p) => {
                        const vote = message.data.results.find((v) => v.user_id === p.user_id);
                        return {
                            ...p,
                            estimate: vote ? vote.estimated_points : undefined
                        };
                    }),
                }));
                break;

            case 'REMAINING_TIME':
                set({ timeLeft: message.data.remaining_seconds });
                break;

            case 'TICKET_SKIPPED':
                set((state) => ({
                    activeTicketId: null,
                    isRevealed: false,
                    participants: state.participants.map((p) => ({ ...p, estimate: undefined }))
                }));
                break;

            case 'SUCCESS':
                set((state) => ({
                    activeTicketId: null,
                    isRevealed: false,
                    resolvedTickets: [...state.resolvedTickets, message.data],
                    participants: state.participants.map((p) => ({ ...p, estimate: undefined }))
                }));
                break;

            case 'STARTED':
                set({
                    timeLeft: message.data.duration,
                    isRevealed: false
                });
                break;

            case 'ENDED':
                set({ activeTicketId: null, timeLeft: 0 });
                break;

            case 'ERROR':
                break;

            default:
                break;
        }
    },
}));
