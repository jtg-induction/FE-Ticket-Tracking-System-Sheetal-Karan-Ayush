import { CheckCircle, HelpOutline } from "@mui/icons-material";
import { Avatar, Box, Card, Grid2 as Grid, Typography } from "@mui/material";

import { useAuthStore } from "@features/auth";
import { ParticipantType } from "@features/pokerPlanning/pokerBoard/pokerBoard.schema";
import { usePokerBoardStore } from "@features/pokerPlanning/pokerBoard/pokerStore";

import { ParticipantsTableProps } from "./ParticipantsTable.types";

export const ParticipantsTable = ({ isRevealed, organizer_id }: ParticipantsTableProps) => {
    const participants = usePokerBoardStore((state) => state.participants);
    const currentUser = useAuthStore((state) => state.user);

    const isUserOrganizer = currentUser?.id === organizer_id;
    return (
        <Grid container spacing={2}>


            {participants.length === 0 ? (
                <Typography color="text.secondary" sx={{ p: 2 }}>
                    Waiting for participants to join
                </Typography>
            )
                :
                (
                    participants.map((p: ParticipantType) => {
                        const shouldShowValue = isRevealed || isUserOrganizer || p.user_id == currentUser?.id;
                        const hasVoted = p.estimate !== undefined;

                        return (
                            <Grid key={p.user_id} >
                                <Card
                                    sx={{
                                        padding: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        border: p.user_id == currentUser?.id ? 1 : 0,
                                        borderColor: 'primary.main'
                                    }}
                                >
                                    <Avatar>{p.name[0]?.toUpperCase()}</Avatar>
                                    <Box flex={1}>
                                        <Typography variant="body2" noWrap>{p.name}</Typography>
                                    </Box>

                                    <Box>
                                        {hasVoted ? (
                                            shouldShowValue ? (
                                                <Typography variant="h6" fontWeight="bold" color="primary">
                                                    {p.estimate}
                                                </Typography>
                                            ) : (
                                                <CheckCircle color="primary" />
                                            )
                                        ) : (
                                            <HelpOutline color="disabled" />
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })

                )
            }
        </Grid>
    );
};
