import { useEffect, useState } from 'react';

import { POSSIBLE_ESTIMATE_VALUES, SCALE_TYPE, SESSION_STATUS } from 'constant/sessionEnums';
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from 'constant/ticketEnums';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

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
import { updateSessionApi } from '@api/pokerPlanning/updateSessionApi';
import { DialogBox } from '@components';
import { StyledErrorTextField } from '@containers/RegisterForm/RegisterForm.styles';
import { SessionResponseType, SessionUpdateSchema, SessionUpdateType } from '@features/pokerPlanning/createSession/session.schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const SessionDetails = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { state } = useLocation()

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<SessionResponseType | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customValueBuffer, setCustomValueBuffer] = useState("");

    const { data: session, isLoading, error } = useQuery({
        queryKey: ['session', sessionId],
        queryFn: () => fetchSessionDetails(Number(sessionId)),
        enabled: !!sessionId,
    });

    const { data: tickets, isLoading: ticketsLoading } = useQuery({
        queryKey: ['session-tickets', sessionId],
        queryFn: () => fetchSessionTickets(Number(sessionId)),
        enabled: !!sessionId,
    });

    const updateMutation = useMutation({
        mutationFn: (payload: SessionUpdateType) => updateSessionApi(Number(sessionId), payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
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

    useEffect(() => {
        if (isEditing && editData?.scale_type === 5) {
            setCustomValueBuffer(editData.custom_scale_values?.join(', ') || "");
        }
    }, [isEditing]);

    if (isLoading) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;
    if (error || !session) return <Typography color="error">Session not found.</Typography>;

    return (
        <>
            <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
                <Box display="flex" justifyContent="space-between" mb={3}>

                </Box>

                {/* Session info */}
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
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
                                    />
                                ) : (
                                    <Typography variant="h6">{session.duration / 60} min</Typography>
                                )}
                            </Grid2>
                            <Grid2 size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary">STATUS</Typography>
                                <Box>
                                    {(() => {
                                        const statusConfig = SESSION_STATUS[session.status as keyof typeof SESSION_STATUS];
                                        return (
                                            <Chip
                                                label={statusConfig?.label || 'Unknown'}
                                                color={(statusConfig?.color as ChipProps['color']) || 'default'}
                                                variant="filled"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        );
                                    })()}
                                </Box>
                            </Grid2>
                        </Grid2>
                    </Stack>
                </Paper>

                {/* Tickets list */}
                <Box mt={6}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                            Tickets ({tickets?.length || 0})
                        </Typography>
                    </Box>

                    <Paper sx={{ borderRadius: 2 }}>
                        {ticketsLoading ? (
                            <CircularProgress size={24} />
                        ) : tickets && tickets.length > 0 ? (
                            <Stack divider={<Divider />}>
                                {tickets.map((ticket) => {
                                    const statusInfo = TICKET_STATUS[ticket.status as keyof typeof TICKET_STATUS] || { label: 'Unknown', color: 'default' };
                                    const priorityInfo = TICKET_PRIORITY[ticket.priority as keyof typeof TICKET_PRIORITY] || { label: 'N/A', color: 'default' };
                                    const typeInfo = TICKET_TYPE[ticket.ticket_type as keyof typeof TICKET_TYPE] || { label: 'Task', color: 'default' };

                                    return (
                                        <Box
                                            display={'flex'}
                                            alignItems={'center'}
                                            gap={2}
                                            key={ticket.id}
                                            padding={2}
                                        >

                                            <Box flex={1}>
                                                <Typography variant="h5" color="text.secondary">
                                                    {ticket.jira_ticket_key}
                                                </Typography>
                                                <Typography variant="body1" >
                                                    {ticket.title}
                                                </Typography>
                                            </Box>

                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Chip
                                                    label={priorityInfo.label}
                                                    size="small"
                                                    color={priorityInfo.color as ChipProps['color']}
                                                />
                                                <Chip
                                                    label={typeInfo.label}
                                                    size="small"
                                                    color={typeInfo.color as ChipProps['color']}
                                                />
                                                <Chip
                                                    label={statusInfo.label}
                                                    size="small"
                                                    color={statusInfo.color as ChipProps['color']}
                                                />
                                                {ticket.points !== null && (
                                                    <Chip
                                                        label={`${ticket.points} pts`}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                )}
                                            </Stack>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Box p={4} textAlign="center">
                                <Typography color="text.secondary">No tickets found for this session.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Box>

            </Box >
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
