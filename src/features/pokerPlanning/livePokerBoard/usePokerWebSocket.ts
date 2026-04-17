import { useCallback, useEffect, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@features/auth";
import { useQueryClient } from "@tanstack/react-query";

import { PokerEvent, PokerEventSchema } from "./pokerBoard.schema";
import { usePokerBoardStore } from "./pokerStore";

export const usePokerWebSocket = (sessionId: number, projectKey: string) => {
    const baseWsUrl = import.meta.env.VITE_WS_URL as string;
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const socket = useRef<WebSocket | null>(null);
    const [lastJsonMessage, setLastJsonMessage] = useState<PokerEvent | null>(null);
    const { updateFromEvent } = usePokerBoardStore();
    const user = useAuthStore((state) => state.user);


    useEffect(() => {
        if (socket.current && (socket.current.readyState === WebSocket.CONNECTING || socket.current.readyState === WebSocket.OPEN)) {
            return;
        }

        const ws = new WebSocket(`${baseWsUrl}${sessionId}`);
        socket.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                event: "GET_PARTICIPANTS_LIST",
                data: {}
            }));

            ws.send(JSON.stringify({
                event: "GET_REMAINING_TIME",
                data: { session_id: sessionId }
            }));

            ws.send(JSON.stringify({
                event: "GET_ACTIVE_TICKET",
                data: {}
            }));
        };

        ws.onmessage = (event: MessageEvent<string>) => {
            try {
                const rawData = JSON.parse(event.data) as unknown;
                const result = PokerEventSchema.safeParse(rawData);

                if (!result.success) {
                    return;
                }
                const eventType = result.data.event;
                const refreshEvents = ['SUCCESS', 'STARTED', 'ENDED', 'TICKET_SKIPPED', 'TICKET_SELECTED'];
                if (refreshEvents.includes(eventType)) {
                    void queryClient.invalidateQueries({ queryKey: ['session', Number(sessionId)], refetchType: 'all' });
                    void queryClient.invalidateQueries({ queryKey: ['session-tickets', Number(sessionId)], refetchType: 'all' });
                }

                if (result.data?.event == 'STARTED') {
                    void navigate(`/projects/${projectKey}/sessions/${sessionId}/board`);
                }
                if (result.data?.event == 'ENDED') {
                    void queryClient.invalidateQueries({ queryKey: ['session', Number(sessionId)], refetchType: 'all' });
                }

                updateFromEvent(result.data, user?.id);
                setLastJsonMessage(result.data);

            } catch (err) {
                console.error(err)
                return;
            }
        };

        ws.onclose = () => {
            if (socket.current === ws) socket.current = null;
        };

        return () => {
            if (socket.current === ws) {
                ws.close();
                socket.current = null;
            }
        };
    }, [sessionId, queryClient]);

    const sendAction = useCallback((action: PokerEvent['event'], payload: Record<string, unknown> = {}) => {
        if (socket.current?.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({ event: action, data: payload }));
        }
    }, []);

    return { sendAction, lastJsonMessage };
};
