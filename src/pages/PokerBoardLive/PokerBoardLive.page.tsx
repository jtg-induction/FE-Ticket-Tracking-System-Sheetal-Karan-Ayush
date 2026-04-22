import { useEffect, useState } from "react";

import { POSSIBLE_ESTIMATE_VALUES } from "constant/sessionEnums";
import { TICKET_PRIORITY, TICKET_TYPE } from "constant/ticketEnums";
import { useNavigate, useParams } from "react-router-dom";

import { Alert, Box, Card, Chip, CircularProgress, Container, Divider, Grid2, Snackbar, Stack, Tooltip, Typography } from "@mui/material";

import { AdminControls, BoardHeader, EstimationDeck, ParticipantsTable, TicketList } from "@containers";
import { useAuthStore } from "@features/auth";
import { usePokerBoardStore } from "@features/pokerPlanning/livePokerBoard/pokerStore";
import { useSessionStore } from "@features/pokerPlanning/pokerSession/useSessionCreateStore";
import { usePokerSessionTicketsData } from "@features/pokerPlanning/sessionDetails/usePokerSessionData";
import { useGetProject } from "@features/project";

import { PokerBoardProps } from "./PokerBoardLive.types";


export const PokerBoard = ({ session, sendAction, lastJsonMessage, onBack }: PokerBoardProps) => {
    const { projectKey, sessionId } = useParams<{ projectKey: string; sessionId: string }>();
    const id = Number(sessionId);

    const navigate = useNavigate();
    
    const isRevealed = usePokerBoardStore((state) => state.isRevealed);
    const user = useAuthStore((state) => state.user);

    const participants = usePokerBoardStore((state) => state.participants);
    const activeTicketId = usePokerBoardStore((state) => state.activeTicketId);

    const resolvedTickets = usePokerBoardStore((state) => state.resolvedTickets);

    const timeLeft = usePokerBoardStore((state) => state.timeLeft);

    const { setSession, currentSession } = useSessionStore();
    const [voteSuccess, setVoteSuccess] = useState(false);

    const [successSnackbar, setSuccessSnackbar] = useState({
        open: false,
        message: "",
    });

    const handleCloseSuccess = () => setSuccessSnackbar({ ...successSnackbar, open: false });


    useEffect(() => {
        sendAction("GET_REMAINING_TIME", { session_id: id });
    }, []);


    useEffect(() => {
        if (session) {
            setSession(session);
        }
    }, [session, setSession]);

    useEffect(() => {
        if (currentSession && activeTicketId !== currentSession.active_ticket_id) {
            setSession({ ...currentSession, active_ticket_id: activeTicketId });
        }
    }, [activeTicketId, currentSession, setSession]);


    useEffect(() => {
        if (lastJsonMessage?.event === 'SUCCESSFULLY_VOTED') {
            if (lastJsonMessage.data.user_id === user?.id) {
                setVoteSuccess(true);
            }
        }
    }, [lastJsonMessage, user?.id]);

    useEffect(() => {
        if (lastJsonMessage?.event === 'SUCCESS') {
            const points = lastJsonMessage.data.estimate;
            setSuccessSnackbar({
                open: true,
                message: `Ticket finalized at ${points} pts. Points updated in Jira!`
            });
        }
    }, [lastJsonMessage]);


    const { data: project, isLoading: isProjectLoading } = useGetProject(projectKey);
    const { data: tickets, isLoading: ticketsLoading } = usePokerSessionTicketsData(Number(sessionId))


    const ticketsData = tickets || [];
    const pendingTicketsList = ticketsData.filter(ticket => ticket.points === null);
    const resolvedTicketsList = ticketsData.filter(ticket => ticket.points !== null);

    if (ticketsLoading || isProjectLoading) {
        return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
    }

    if (!session) {
        return <Container sx={{ mt: 4 }}><Typography color="error.contrastText">Failed to load session.</Typography></Container>;
    }


    const isOrganizer = user?.id === session?.organizer_id;
    const activeTicket = tickets?.find(t => t.id === activeTicketId);

    const handleActivateTicket = (ticketId: number) => {
        sendAction("SELECT_TICKET", { ticket_id: ticketId });
    };

    const handleReveal = () => {
        if (activeTicketId) sendAction("REVEAL", { ticket_id: activeTicketId });
    };

    const handleSkip = () => {
        if (activeTicketId) sendAction("SKIP_TICKET", { ticket_id: activeTicketId });
    };

    const handleConfirm = (estimate: number) => {
        if (activeTicketId) sendAction("FINAL_ESTIMATE_TICKET", { ticket_id: activeTicketId, estimate });
    };


    const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setVoteSuccess(false);
    };

    const estimateOptions = session.scale_type === 5
        ? session.custom_scale_values || []
        : POSSIBLE_ESTIMATE_VALUES[session.scale_type as keyof typeof POSSIBLE_ESTIMATE_VALUES] || [];

    const handleVote = (points: number) => {
        if (activeTicketId) {
            sendAction('VOTE', {
                ticket_id: activeTicketId,
                estimate: points,
            });
        }
    };

    return (
        <Stack sx={{ padding: 4 }} spacing={2} >


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

            <Divider />

            <BoardHeader
                projectKey={projectKey}
                timeleft={timeLeft}
                sendAction={sendAction}
                onBack={onBack}
            />

            <Grid2 container spacing={3}>

                <Grid2 size={{ xs: 12, md: 8 }}>
                    <Grid2 container spacing={4}>

                        {/* active ticket details*/}
                        <Grid2 size={12} >
                            <Card
                                elevation={2}
                                sx={{
                                    padding: 4,
                                }}
                            >
                                {activeTicket ? (
                                    <Box>
                                        <Box display={'flex'} justifyContent={'space-between'} >

                                            <Box display={'flex'} gap={2} alignItems={'center'}>
                                                <Typography variant="caption" color="text.secondary">Ticket Key:</Typography>
                                                <Typography variant="h4" >{activeTicket.jira_ticket_key}</Typography>
                                            </Box>
                                            <Stack direction="row" spacing={1}>
                                                <Chip label={TICKET_PRIORITY[activeTicket.priority as keyof typeof TICKET_PRIORITY]?.label} variant="outlined" size="small" />
                                                <Chip label={TICKET_TYPE[activeTicket.ticket_type as keyof typeof TICKET_TYPE]?.label} color="info" size="small" />
                                            </Stack>
                                        </Box>

                                        <Typography variant="h3" >
                                            {activeTicket.title}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary">
                                            {activeTicket.description || "Description not provided."}
                                        </Typography>

                                        <Divider sx={{ mb: 3 }} />

                                        <Stack spacing={2}>
                                            <Box display={'flex'} gap={2} alignItems={'center'}>
                                                <Typography variant="caption" color="text.secondary">ASSIGNEE</Typography>
                                                <Typography variant="body2">{activeTicket.assignee || 'Unassigned'}</Typography>
                                            </Box>
                                            <Box display={'flex'} gap={2} alignItems={'center'}>
                                                <Typography variant="caption" color="text.secondary">DEADLINE</Typography>
                                                <Typography variant="body2">{activeTicket.deadline || "None"}</Typography>
                                            </Box>

                                            <Box display={'flex'} gap={2} alignItems={'center'}>
                                                <Typography variant="caption" color="text.secondary">LABELS</Typography>
                                                <Box display="flex" gap={0.5}>
                                                    {activeTicket.labels.length > 0 ? activeTicket.labels.map(l => <Chip key={l} label={l} size="small" variant="outlined" />)
                                                        :
                                                        <Typography variant="body2">None</Typography>}
                                                </Box>
                                            </Box>

                                        </Stack>
                                    </Box>
                                ) : (
                                    <Box padding={4} textAlign="center">
                                        <Typography variant="h4" color="text.secondary" >
                                            {isOrganizer ? "Select a ticket to begin voting" : "Waiting for organizer to select a ticket"}
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        </Grid2>

                        {/* ACTIVE PARTICIPANTS */}
                        <Grid2 size={12}>
                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography variant="h5">Current Participants</Typography>
                            </Box>
                            <ParticipantsTable
                                isRevealed={isRevealed}
                                organizer_id={session?.organizer_id}
                            />
                        </Grid2>
                    </Grid2>
                </Grid2>

                {/* RIGHT COLUMN */}
                <Grid2 size={{ xs: 12, md: 4 }}>

                    <Stack spacing={3}>
                        {isOrganizer &&
                            <AdminControls
                                activeTicketId={activeTicketId}
                                onReveal={handleReveal}
                                onSkip={handleSkip}
                                onConfirm={handleConfirm}
                                participants={participants}
                                allowedValues={estimateOptions}
                                lastJsonMessage={lastJsonMessage}
                                isRevealed={isRevealed}
                            />
                        }

                        <Stack spacing={2}>
                            <TicketList
                                tickets={pendingTicketsList}
                                activeTicketId={activeTicketId}
                                showControls={true}
                                isOrganizer={isOrganizer}
                                onActivate={handleActivateTicket}
                                resolvedTickets={resolvedTickets}
                                heading="Pending Tickets"
                                defaultExpanded={true}
                            />
                            <TicketList
                                tickets={resolvedTicketsList}
                                activeTicketId={activeTicketId}
                                showControls={true}
                                isOrganizer={isOrganizer}
                                onActivate={handleActivateTicket}
                                resolvedTickets={resolvedTickets}
                                heading="Completed Tickets"
                                defaultExpanded={false}
                            />
                        </Stack>
                    </Stack>
                </Grid2>
            </Grid2>

            {/* Bottom Voting Cards */}
            <Box position={'fixed'} bottom={0} bgcolor={'common.white'} alignSelf={'center'}>
                <Typography variant="body1" textAlign={'center'}>Select points for the ticket.</Typography>

                <Snackbar
                    open={voteSuccess}
                    autoHideDuration={2000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="success"
                        variant="filled"
                    >
                        Voted Successfully
                    </Alert>
                </Snackbar>


                <EstimationDeck
                    options={estimateOptions}
                    activeTicketId={activeTicketId}
                    onVote={handleVote}
                    participants={participants}
                    currentUserId={user?.id}
                />
            </Box>

            <Snackbar
                open={successSnackbar.open}
                autoHideDuration={2000}
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    variant="filled"
                >
                    {successSnackbar.message}
                </Alert>
            </Snackbar>

        </Stack>
    );
};
