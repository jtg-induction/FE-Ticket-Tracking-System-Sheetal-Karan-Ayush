import { useEffect, useState } from 'react';

import { POSSIBLE_ESTIMATE_VALUES, SCALE_TYPE, SESSION_STATUS } from 'constant/sessionEnums';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { PlayArrow } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button, Chip, ChipProps, CircularProgress, Divider, FormControl, Grid2,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack, TextField, Typography
} from '@mui/material';

import { deleteSessionApi } from '@api/pokerPlanning/deleteSessionApi';
import { fetchSessionDetails } from '@api/pokerPlanning/getSessionDetailsApi';
import { fetchSessionTickets } from '@api/pokerPlanning/getSessionTicketsApi';
import { joinSessionApi } from '@api/pokerPlanning/joinSessionApi';
import { updateSessionApi } from '@api/pokerPlanning/updateSessionApi';
import { BackButton, DialogBox } from '@components';
import { StyledErrorTextField } from '@containers/RegisterForm/RegisterForm.styles';
import { TicketList } from '@containers/TicketList';
import { useAuthStore } from '@features/auth';
import { SessionResponseType, SessionUpdateSchema, SessionUpdateType } from '@features/pokerPlanning/createSession/session.schemas';
import { usePokerBoardStore } from '@features/pokerPlanning/pokerBoard/pokerStore';
import { usePokerWebSocket } from '@features/pokerPlanning/pokerBoard/usePokerWebSocket';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


export const SessionDetails = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const id = Number(sessionId);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { state } = useLocation()

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<SessionResponseType | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customValueBuffer, setCustomValueBuffer] = useState("");
    const remainingTime = usePokerBoardStore((pokerState) => pokerState.timeLeft);

    const { data: session, isLoading, error } = useQuery({
        queryKey: ['session', sessionId],
        queryFn: () => fetchSessionDetails(Number(sessionId)),
        enabled: !!sessionId,
        refetchOnMount: true,
    });

    const user = useAuthStore((userState) => userState.user);

    const isOrganizer = user?.id === session?.organizer_id;


    const { sendAction, lastJsonMessage } = usePokerWebSocket(Number(sessionId));

    useEffect(() => {

        if (remainingTime === 0) {
            const timeout = setTimeout(() => {
                void queryClient.invalidateQueries({ queryKey: ['session', id] });
                void queryClient.invalidateQueries({ queryKey: ['sessions', state] });
            }, Math.random() * 500);
            return () => clearTimeout(timeout);
        }

        if (!lastJsonMessage) return;

        const stateChangingEvents = ['SUCCESS', 'STARTED', 'ENDED'];

        if (stateChangingEvents.includes(lastJsonMessage.event)) {
            void queryClient.invalidateQueries({ queryKey: ['session', id] });
            void queryClient.invalidateQueries({ queryKey: ['sessions', state] });
        }

    }, [lastJsonMessage, queryClient, sessionId, remainingTime]);

    const { data: tickets } = useQuery({
        queryKey: ['session-tickets', sessionId],
        queryFn: () => fetchSessionTickets(Number(sessionId)),
        enabled: !!sessionId,
        refetchOnMount: true,
    });

    const ticketsData = tickets || [];
    const pendingTicketsList = ticketsData.filter(ticket => ticket.points === null);
    const resolvedTicketsList = ticketsData.filter(ticket => ticket.points !== null);



    const updateMutation = useMutation({
        mutationFn: (payload: SessionUpdateType) => updateSessionApi(Number(sessionId), payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['session', id] });
            void queryClient.invalidateQueries({ queryKey: ['sessions', state] });
            setIsEditing(false);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteSessionApi(Number(sessionId)),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['sessions', state] });
            void navigate(-1);
        }
    });

    const joinMutation = useMutation({
        mutationFn: (role: number) => joinSessionApi(Number(sessionId), role),
        onSuccess: () => {
            void navigate(`/sessions/${sessionId}/board`);
        },
    });

    const handleDelete = () => {
        deleteMutation.mutate();
        setDeleteDialogOpen(false);
    };

    const handleSave = () => {
        if (!editData) return;
        const result = SessionUpdateSchema.safeParse(editData);

        if (!result.success) {
            return;
        }

        updateMutation.mutate(result.data);
    };


    const handleStart = (customDuration?: number) => {
        sendAction("START", {
            duration: customDuration ?? session?.duration,
        });
        void queryClient.invalidateQueries({
            queryKey: ['poker-session', id],
            refetchType: 'all',
        });
        void queryClient.invalidateQueries({
            queryKey: ['sessions', state],
            refetchType: 'all',
        });

        void navigate(`/sessions/${sessionId}/board`);
    };

    const handleRestart = () => {
        sendAction("START", {
            duration: session?.duration,
        });
        void queryClient.invalidateQueries({
            queryKey: ['poker-session', id],
            refetchType: 'all',
        });
        void queryClient.invalidateQueries({
            queryKey: ['sessions', state],
            refetchType: 'all',
        });
        void navigate(`/sessions/${sessionId}/board`);
    };

    const handleJoinAsVoter = () => {
        joinMutation.mutate(2);
        void navigate(`/sessions/${sessionId}/board`);
    };

    const handleJoinAsSpectator = () => {
        joinMutation.mutate(3);
        void navigate(`/sessions/${sessionId}/board`);
    };

    const handleEnd = () => {
        sendAction("END", {});
        void queryClient.invalidateQueries({
            queryKey: ['poker-session', id],
            refetchType: 'all',
        });
        void queryClient.invalidateQueries({
            queryKey: ['sessions', state],
            refetchType: 'all',
        });
        void queryClient.invalidateQueries({ queryKey: ['session', id] });
    };

    useEffect(() => {
        if (isEditing && editData?.scale_type === 5) {
            setCustomValueBuffer(editData.custom_scale_values?.join(', ') || "");
        }
    }, [isEditing]);

    if (isLoading) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;
    if (error || !session) return <Typography color="error">Session not found.</Typography>;

    return (
        <>
            <Stack spacing={4} padding={4}>

                <Paper sx={{ padding: 4 }}>
                    <Box>
                        <BackButton />
                    </Box>
                    <Stack spacing={3} >
                        <Box display={'flex'} gap={2} justifyContent={'space-between'} alignItems={'start'}>
                            <Box flex={1}>
                                {isEditing ? (
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Title"
                                            fullWidth
                                            value={editData?.title || ""}
                                            onChange={(e) => {
                                                setEditData((prev) => prev ? { ...prev, title: e.target.value } : prev);
                                            }} />
                                        <TextField
                                            label="Description"
                                            multiline rows={3}
                                            fullWidth
                                            value={editData?.description || ""}
                                            onChange={(e) => {
                                                setEditData((prev) => prev ? { ...prev, description: e.target.value } : prev);
                                            }} />

                                        <FormControl fullWidth>
                                            <InputLabel id="scale-type-label">Estimation Scale</InputLabel>
                                            <Select
                                                label="Estimation Scale"
                                                value={editData?.scale_type || 1}
                                                onChange={(e) => setEditData(prev => prev ? {
                                                    ...prev,
                                                    scale_type: Number(e.target.value)
                                                } : prev)}
                                            >
                                                <MenuItem value={1}>Fibonacci</MenuItem>
                                                <MenuItem value={2}>Linear</MenuItem>
                                                <MenuItem value={3}>Even</MenuItem>
                                                <MenuItem value={4}>Odd</MenuItem>
                                                <MenuItem value={5}>Custom</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {editData?.scale_type === 5 && (
                                            <StyledErrorTextField
                                                label="Custom scale values"
                                                placeholder="e.g. 1, 5, 10"
                                                required
                                                value={customValueBuffer}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    setCustomValueBuffer(rawValue);

                                                    const values = rawValue
                                                        .split(',')
                                                        .map(v => parseInt(v.trim()))
                                                        .filter(v => !isNaN(v));

                                                    setEditData(prev => prev ? { ...prev, custom_scale_values: values } : prev);
                                                }}
                                                helperText="Enter numbers separated by commas"
                                                fullWidth
                                            />
                                        )}

                                    </Stack>
                                ) : (
                                    <Box display={'flex'} flexDirection={'column'} gap={2}>
                                        <Box>
                                            <Typography variant="h3" fontWeight={800} color="primary">{session.title.toUpperCase()}</Typography>
                                            <Typography variant="body1" color="text.secondary">{session.description}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box display={'flex'} flexDirection={'column'} gap={2}>
                                            <Box display={'flex'}>
                                                <Typography color='text.secondary'>Scale Type: </Typography>
                                                <Typography>{SCALE_TYPE[session.scale_type as keyof typeof SCALE_TYPE] ?? 'Invalid Scale'}</Typography>

                                            </Box>
                                            <Box display={'flex'}>
                                                <Typography color='text.secondary'>Possible Estimates: </Typography>
                                                <Typography>
                                                    {session.scale_type === 5
                                                        ? (session.custom_scale_values?.join(', ') || 'No Custom Values')
                                                        : (POSSIBLE_ESTIMATE_VALUES[session.scale_type as keyof typeof POSSIBLE_ESTIMATE_VALUES]?.join(', ') ?? 'Invalid Scale')
                                                    }
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Box>

                            {isOrganizer && (
                                <Stack direction="row" spacing={1}>
                                    {!isEditing ? (
                                        <>
                                            <Button startIcon={<EditIcon />} onClick={() => {
                                                setEditData(session);
                                                setIsEditing(true);
                                            }}>Edit</Button>
                                            <Button
                                                startIcon={<DeleteIcon />}
                                                sx={{ color: "error.contrastText" }}
                                                onClick={() => setDeleteDialogOpen(true)}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="contained" onClick={handleSave} disabled={updateMutation.isPending}>Save</Button>
                                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                        </>
                                    )}
                                </Stack>
                            )}
                        </Box>

                        <Divider />

                        <Grid2 container justifyContent={'space-between'} width={'100%'}>
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="text.secondary">Duration (minutes)</Typography>
                                {isEditing ? (
                                    <TextField
                                        type="number"
                                        fullWidth
                                        value={(editData?.duration || 0) / 60}
                                        onChange={(e) => {
                                            const minutes = Number(e.target.value);
                                            setEditData((prev) => prev ? { ...prev, duration: minutes * 60 } : prev);
                                        }}
                                        slotProps={{ htmlInput: { min: 1 } }}
                                    />

                                ) : (
                                    <Typography variant="h6">{session.duration / 60} min</Typography>
                                )}
                            </Grid2>

                        </Grid2>



                        <Box sx={{ maxWidth: 900, }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

                                <Box display={'flex'} alignItems={'center'} gap={2}>
                                    <Typography variant='caption' color='text.secondary'>STATUS:</Typography>
                                    <Chip
                                        label={SESSION_STATUS[session.status as keyof typeof SESSION_STATUS].label}
                                        color={SESSION_STATUS[session.status as keyof typeof SESSION_STATUS].color as ChipProps['color']}
                                        variant="filled"
                                    />
                                </Box>

                                <Stack direction="row" spacing={2}>

                                    {isOrganizer && (
                                        <>
                                            {session.status === 1 && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<PlayArrow />}
                                                    onClick={() => handleStart()}
                                                >
                                                    Start Session
                                                </Button>
                                            )}
                                            {session.status === 2 && (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleEnd()}
                                                >
                                                    End Session
                                                </Button>
                                            )}
                                            {session.status === 3 && (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleRestart()}
                                                >
                                                    Restart Session
                                                </Button>
                                            )}
                                        </>
                                    )}

                                    {(session.status === 2) && (!isOrganizer) && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="info"
                                                onClick={handleJoinAsVoter}
                                            >
                                                Join As Voter
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="info"
                                                onClick={handleJoinAsSpectator}
                                            >
                                                Join As Spectator
                                            </Button>
                                        </>
                                    )}
                                    {(session.status === 2) &&
                                        isOrganizer &&
                                        <Button
                                            variant="contained"
                                            color="info"
                                            onClick={() => void navigate(`/sessions/${sessionId}/board`)}
                                        >
                                            Join
                                        </Button>
                                    }
                                </Stack>
                            </Box>


                        </Box>


                    </Stack>
                </Paper>

                <Stack spacing={2}>
                    <TicketList
                        tickets={pendingTicketsList}
                        heading="Pending Tickets"
                        defaultExpanded={true}
                    />
                    <TicketList
                        tickets={resolvedTicketsList}
                        heading="Completed Tickets"
                        defaultExpanded={false}
                    />
                </Stack>

            </Stack >
            <DialogBox
                open={deleteDialogOpen}
                title="Confirm Deletion"
                onClose={() => setDeleteDialogOpen(false)}
                onSubmit={handleDelete}
                submitText="Delete"
                cancelText="Cancel"
                isSubmitting={deleteMutation.isPending}
            >
                <Typography>
                    Are you sure you want to delete the session?
                </Typography>
            </DialogBox>
        </>
    );
};
