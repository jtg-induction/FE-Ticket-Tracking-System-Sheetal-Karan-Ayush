import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { AccessTimeFilled } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import { BackButton } from "@components";
import { useAuthStore } from "@features/auth";
import { useSessionStore } from "@features/pokerPlanning/createSession/useSessionCreateStore";
import { usePokerBoardStore } from "@features/pokerPlanning/pokerBoard/pokerStore";
import { useQueryClient } from "@tanstack/react-query";

import { BoardHeaderProps } from "./BoardHeader.types";

export const BoardHeader = ({ sendAction }: BoardHeaderProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const session = useSessionStore((state) => state.currentSession);

    const user = useAuthStore((state) => state.user);
    const isOrganizer = user?.id === session?.organizer_id;

    const remainingTime = usePokerBoardStore((state) => state.timeLeft);

    const [timeLeft, setTimeLeft] = useState<number | null>(remainingTime);


    useEffect(() => {
        if (remainingTime !== null) {
            setTimeLeft(remainingTime);
            if (remainingTime <= 0) {
                if (session?.id) {
                    void queryClient.invalidateQueries({
                        queryKey: ['poker-session', session?.id]
                    });
                }
                void navigate(-1);
            }
        }
    }, [remainingTime]);


    useEffect(() => {
        if (timeLeft !== null && timeLeft <= 0) {
            void queryClient.invalidateQueries({
                queryKey: ['poker-session', session?.id]
            });
            void queryClient.invalidateQueries({ queryKey: ['session', session?.id] });

            void navigate(-1);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);


    const formatTime = (seconds: number | null) => {
        if (seconds === null) return "--:--";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };


    const handleEndSession = () => {
        sendAction("END", {});
        if (session?.id) {

            void queryClient.invalidateQueries({
                queryKey: ['poker-session', session?.id]
            });
            void queryClient.invalidateQueries({ queryKey: ['session', session.id] });
        }
        void navigate(-1);
    };

    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" padding={2}>
            <Box display={'flex'} gap={2} alignItems={'center'}>
                <BackButton />

                <Typography variant="h4" fontWeight="bold" color="primary">
                    Session: {session?.title}
                </Typography>
            </Box>

            <Box display={'flex'} gap={2}>

                {isOrganizer && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleEndSession}
                    >
                        End Session
                    </Button>
                )}

                <Box display={'flex'} alignItems={'center'} gap={2} justifyContent={'center'} padding={2} border={1} borderColor={'primary.main'} borderRadius={2}>
                    <AccessTimeFilled color={'primary'} />
                    <Typography
                        variant="h4"
                        color="primary"
                    >
                        {formatTime(timeLeft)}
                    </Typography>
                </Box>
            </Box>

        </Stack>
    );
};
