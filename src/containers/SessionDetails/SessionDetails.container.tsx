import { useEffect, useState } from 'react';

import { POSSIBLE_ESTIMATE_VALUES, SCALE_TYPE, SESSION_STATUS } from 'constant/sessionEnums';
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from "constant/ticketEnums";
import { useDebounce } from 'hooks/useDebounce';
import { useNavigate, useParams } from 'react-router-dom';

import { PlayArrow } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box, Button, Checkbox, Chip, ChipProps, CircularProgress, Divider, FormControl, Grid2,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    MenuItem,
    Paper,
    Select,
    Stack, TextField, Tooltip, Typography
} from '@mui/material';

import { BackButton, DialogBox, ProjectTicketFilters } from '@components';
import { Ticket } from '@containers/PokerSessionForm/PokerSessionForm.types';
import { StyledErrorTextField } from '@containers/RegisterForm/RegisterForm.styles';
import { TicketList } from '@containers/TicketList';
import { useAuthStore } from '@features/auth';
import { usePokerWebSocket } from '@features/pokerPlanning/livePokerBoard/usePokerWebSocket';
import { SessionResponseType, SessionUpdateSchema, TicketResponseType } from '@features/pokerPlanning/pokerSession/session.schemas';
import { usePokerSessionMutations } from '@features/pokerPlanning/pokerSession/usePokerSessionMutation';
import { usePokerSessionData, usePokerSessionTicketsData } from '@features/pokerPlanning/sessionDetails/usePokerSessionData';
import { useGetProject } from '@features/project/useGetProjectMutation';
import { QueryParams } from '@features/ticket/getAllTickets/getAllTickets.schema';
import { useGetAllTickets } from '@features/ticket/getAllTickets/usegetAllTickets';
import { PokerBoard } from '@pages/PokerBoardLive/PokerBoardLive.page';


export const SessionDetails = () => {
    const { projectKey, sessionId } = useParams<{ projectKey: string, sessionId: string }>();

    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<SessionResponseType | undefined>();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customValueBuffer, setCustomValueBuffer] = useState("");

    const [view, setView] = useState<'details' | 'live'>('details');

    const { data: session, isLoading, error } = usePokerSessionData(Number(sessionId));
    const { data: project, isLoading: isProjectLoading } = useGetProject(projectKey as string);

    const user = useAuthStore((userState) => userState.user);
    const isOrganizer = user?.id === session?.organizer_id;
    const isSessionRunning = session?.status === 2;
    const canEdit = isOrganizer && !isSessionRunning;

    const { data: tickets } = usePokerSessionTicketsData(Number(sessionId));
    const ticketsData = tickets || [];
    const pendingTicketsList = ticketsData.filter(ticket => ticket.points === null);
    const resolvedTicketsList = ticketsData.filter(ticket => ticket.points !== null);

    const { sendAction, lastJsonMessage } = usePokerWebSocket(Number(sessionId), projectKey as string, (newView) => setView(newView));


    const defaultFilters: QueryParams = {
        title: "",
        assignee: "",
        status: undefined,
        sort: "latest",
        limit: 25,
        deadline: undefined,
    };

    const [filters, setFilters] = useState<QueryParams>(defaultFilters);
    const debouncedFilters = useDebounce(filters, 500);

    const { data: availableTicketsData, isLoading: isFetchingTickets } = useGetAllTickets(
        projectKey ?? "",
        debouncedFilters,
        { enabled: isEditing && !!projectKey }
    );

    const allAvailableTickets = availableTicketsData?.pages.flatMap((page) =>
        (page.tickets as Ticket[]).filter(ticket => ticket.status !== 3)
    ) ?? [];

    const selectedFullTickets = editData?.tickets_list?.map(selected =>
        ticketsData.find(t => t.id === selected.id) ||
        allAvailableTickets.find(t => t.id === selected.id) ||
        selected
    ) || [];


    const { updateMutation, deleteMutation } = usePokerSessionMutations(Number(sessionId), projectKey);

    const toggleTicket = (ticket: TicketResponseType) => {
        setEditData((prev) => {
            if (!prev) return prev;
            const currentList = prev.tickets_list || [];
            const isSelected = currentList.some((t) => t.id === ticket.id);

            const newList = isSelected
                ? currentList.filter((t) => t.id !== ticket?.id)
                : [...currentList, { id: ticket?.id, jira_ticket_key: ticket?.jira_ticket_key }];

            return { ...prev, tickets_list: newList };
        });
    };

    const handleDelete = () => {
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                sendAction("BROADCAST_SESSION_DELETED", {});
            }
        });
        setDeleteDialogOpen(false);
    };

    const handleSave = () => {
        if (!editData) return;
        const result = SessionUpdateSchema.safeParse(editData);
        if (!result.success) {
            return;
        }
        updateMutation.mutate(result.data, {
            onSuccess: () => {
                sendAction("BROADCAST_SESSION_UPDATED", {});
            }
        });
        setIsEditing(false);
    };

    const handleStart = (customDuration?: number) => {
        sendAction("START", {
            duration: customDuration ?? session?.duration,
        });
        setView('live');
    };

    const handleRestart = () => {
        sendAction("START", {
            duration: session?.duration,
        });
        setView('live');
    };

    const handleJoinAsOrganizer = () => {
        sendAction("JOIN", { role: 1 });
        setView('live');
    };

    const handleJoinAsVoter = () => {
        sendAction("JOIN", { role: 2 });
        setView('live');
    };

    const handleJoinAsSpectator = () => {
        sendAction("JOIN", { role: 3 });
        setView('live');
    };

    const handleEnd = () => {
        sendAction("END", {});
        setView('details');
    };

    useEffect(() => {
        if (isEditing && editData?.scale_type === 5) {
            setCustomValueBuffer(editData.custom_scale_values?.join(', ') || "");
        }
    }, [isEditing]);

    if (isLoading || isProjectLoading || isFetchingTickets) return <Box textAlign="center" mt={10}><CircularProgress /></Box>;
    if (error || !session) return <Typography variant='h2' color="error.contrastText" textAlign='center'>Session not found.</Typography>;

    if (view === 'live') {
        return <PokerBoard session={session} sendAction={sendAction} lastJsonMessage={lastJsonMessage} onBack={() => setView('details')} />;
    }

    return (
        <>
            <Stack spacing={4} padding={4}>

                <Box display={'flex'} gap={2} >
                    <BackButton onClick={() => void navigate(`/projects/${projectKey}/sessions/`)} />
                    <Box>
                        <Tooltip title="View Project Details">
                            <Box
                                onClick={() => void navigate(`/project/${projectKey}`)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Typography variant="h5" color="text.primary" fontWeight={700}>
                                    {projectKey} : {project?.title}
                                </Typography>
                            </Box>
                        </Tooltip>
                        <Box maxHeight={60}>
                            <Typography variant="caption" color="text.secondary">
                                {project?.description}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Paper sx={{ padding: 4 }}>
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
                                            <Box maxHeight={72} overflow={'auto'}>
                                                <Typography variant="body1" color="text.secondary">{session.description}</Typography>
                                            </Box>
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

                            {canEdit && (
                                <Stack direction="row" spacing={1}>
                                    {!isEditing ? (
                                        <>
                                            <Button startIcon={<EditIcon />} onClick={() => {
                                                const currentTickets = ticketsData.map(t => ({
                                                    id: t.id,
                                                    jira_ticket_key: t.jira_ticket_key
                                                }));
                                                setEditData({
                                                    ...session,
                                                    tickets_list: currentTickets
                                                });
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
                                        value={editData?.duration ? editData.duration / 60 : null}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            const minutes = val === null ? 0 : Number(val);
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

                                    {isOrganizer && !isEditing && (
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
                                            onClick={handleJoinAsOrganizer}
                                        >
                                            Join
                                        </Button>
                                    }
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>
                </Paper>

                {isEditing ?

                    (
                        <Stack spacing={3}>

                            <Typography variant="h6">Edit Tickets</Typography>

                            <ProjectTicketFilters
                                filters={filters}
                                onChange={(field, val) => setFilters(prev => ({ ...prev, [field]: val }))}
                                onReset={() => setFilters(defaultFilters)}
                            />
                            <Paper sx={{ padding: 2, maxHeight: 428, overflow: 'auto' }}>
                                <Typography variant="subtitle2">Available Tickets</Typography>
                                <List dense>


                                    {allAvailableTickets.map((ticket: Ticket) => {

                                        const status = TICKET_STATUS[ticket.status as 1 | 2 | 3];
                                        const priority = TICKET_PRIORITY[ticket.priority as 1 | 2 | 3];
                                        const type = TICKET_TYPE[ticket.ticket_type as 1 | 2 | 3 | 4 | 5];

                                        const isSelected = editData?.tickets_list.some(t => t.id === ticket.id);

                                        return (
                                            <ListItem key={ticket.id} divider disablePadding>
                                                <ListItemButton onClick={() => toggleTicket(ticket)}>
                                                    <Checkbox checked={isSelected} disableRipple />

                                                    <Stack direction="row" spacing={2} alignItems="center" width="100%">
                                                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                                                            {ticket.jira_ticket_key}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                                            {ticket.title}
                                                        </Typography>

                                                        {ticket.points &&
                                                            (<Chip
                                                                label={`${ticket.points} pts`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />)}

                                                        <Chip
                                                            label={type?.label || "Task"}
                                                            size="small"
                                                            color={(type?.color as ChipProps["color"]) || "default"}
                                                        />
                                                        <Chip
                                                            label={priority?.label || "Low"}
                                                            size="small"
                                                            color={(priority?.color as ChipProps["color"]) || "default"}
                                                        />
                                                        <Chip
                                                            label={status?.label || "Open"}
                                                            size="small"
                                                            color={(status?.color as ChipProps["color"]) || "default"}
                                                        />
                                                    </Stack>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}

                                </List>
                            </Paper>

                            <Paper variant="outlined" sx={{ padding: 2, maxHeight: 428, overflow: 'auto' }}>
                                <TicketList
                                    tickets={selectedFullTickets}
                                    heading="Selected Tickets"
                                    defaultExpanded={true}
                                />

                            </Paper>
                        </Stack>
                    )


                    :

                    (<Stack spacing={2}>
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
                    </Stack>)}

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
