import { createSession } from "@api/pokerPlanning/createSessionApi";
import { deleteSessionApi } from "@api/pokerPlanning/deleteSessionApi";
import { updateSessionApi } from "@api/pokerPlanning/updateSessionApi";
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { SessionCreateType, SessionUpdateType } from "./session.schemas";

export const usePokerSessionMutations = (sessionId?: number, projectKey?: string) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (payload: SessionCreateType) =>
            createSession({
                ...payload,
                duration: payload.duration * 60
            }),
    });

    const updateMutation = useMutation({
        mutationFn: (payload: SessionUpdateType) => updateSessionApi(Number(sessionId), payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['session', Number(sessionId)] });
            void queryClient.invalidateQueries({ queryKey: ['sessions', projectKey] });
            void queryClient.invalidateQueries({ queryKey: ['session-tickets', Number(sessionId)] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteSessionApi(Number(sessionId)),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['sessions', projectKey] });
        }
    });

    return { createMutation, updateMutation, deleteMutation }

}
