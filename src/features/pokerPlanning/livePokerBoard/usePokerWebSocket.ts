import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useAuthStore } from "@features/auth";
import { useQueryClient } from "@tanstack/react-query";

import { PokerEvent, PokerEventSchema } from "./pokerBoard.schema";
import { usePokerBoardStore } from "./pokerStore";

export const usePokerWebSocket = (
    sessionId: number,
    projectKey: string,
    onViewChange?: (view: 'details' | 'live') => void
) => {
    const baseWsUrl = import.meta.env.VITE_WS_URL as string;
    const socketUrl = `${baseWsUrl}${sessionId}`;

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { updateFromEvent } = usePokerBoardStore();

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
        shouldReconnect: (closeEvent) => {
            if (closeEvent.code === 1008) {
                console.log("WebSocket connection stopped: Permission denied or Session not found.");
                return false;
            }
            return true;
        },
        reconnectAttempts: 5,
        reconnectInterval: (attemptNumber) => Math.min(Math.pow(2, attemptNumber) * 1000, 10000),

        onOpen: () => {
            console.log("WebSocket connected");
            void queryClient.invalidateQueries({ queryKey: ['session', Number(sessionId)], refetchType: 'all' });
            void queryClient.invalidateQueries({ queryKey: ['session-tickets', Number(sessionId)], refetchType: 'all' });
            void queryClient.invalidateQueries({ queryKey: ['sessions', projectKey], refetchType: 'all' });
        },

        onMessage: (event: MessageEvent<string>) => {
            try {
                const rawData = JSON.parse(event.data) as unknown;
                const result = PokerEventSchema.safeParse(rawData);

                if (!result.success) return;

                const eventType = result.data.event;
                const refreshEvents = ['SUCCESS', 'STARTED', 'ENDED', 'TICKET_SKIPPED', 'TICKET_SELECTED', 'REMAINING_TIME', 'SESSION_UPDATED'];

                if (refreshEvents.includes(eventType)) {
                    void queryClient.invalidateQueries({ queryKey: ['session', Number(sessionId)], refetchType: 'all' });
                    void queryClient.invalidateQueries({ queryKey: ['session-tickets', Number(sessionId)], refetchType: 'all' });
                    void queryClient.invalidateQueries({ queryKey: ['sessions', projectKey], refetchType: 'all' });
                }

                if (eventType === 'SESSION_DELETED') {
                    void queryClient.invalidateQueries({ queryKey: ['sessions', projectKey], refetchType: 'all' });
                    void navigate(`/projects/${projectKey}/sessions/`);
                }

                if (eventType === 'STARTED') {
                    sendJsonMessage({ event: "GET_REMAINING_TIME", data: { session_id: sessionId } });
                }

                if (eventType === 'JOINED_SUCCESSFULLY') {
                    onViewChange?.('live');
                    sendJsonMessage({ event: "GET_PARTICIPANTS_LIST", data: {} });
                    sendJsonMessage({ event: "GET_REMAINING_TIME", data: { session_id: sessionId } });
                    sendJsonMessage({ event: "GET_ACTIVE_TICKET", data: {} });
                    sendJsonMessage({ event: "GET_VOTE_REVEALED_STATUS", data: {} });
                }

                if (eventType === 'ENDED') {
                    onViewChange?.('details');
                    void queryClient.invalidateQueries({ queryKey: ['session', Number(sessionId)], refetchType: 'all' });
                }

                if (eventType === 'REMAINING_TIME' && result.data.data.remaining_seconds === 0) {
                    sendJsonMessage({ event: "END", data: {} });
                    onViewChange?.('details');
                }

                updateFromEvent(result.data, user?.id);
            } catch (err) {
                console.error(err);
            }
        },
        share: true,
    });

    const sendAction = useCallback((action: PokerEvent['event'], payload: Record<string, unknown> = {}) => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({ event: action, data: payload });

            if (action === 'START' || action === 'JOIN') {
                onViewChange?.('live');
            } else if (action === 'END') {
                onViewChange?.('details');
            }

            void queryClient.invalidateQueries({ queryKey: ['session', Number(sessionId)], refetchType: 'all' });
        }
    }, [readyState, sendJsonMessage, sessionId, onViewChange, queryClient]);

    return {
        sendAction,
        lastJsonMessage: lastJsonMessage ? (lastJsonMessage as PokerEvent) : null,
        isConnected: readyState === ReadyState.OPEN,
        readyState
    };
};
