import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid2, Paper, Stack, Typography } from "@mui/material";

import { LocationState } from "@containers/PokerSessionForm/PokerSessionForm.types";
import { useGetSessions } from "@features/pokerPlanning/getProjectSessions/useGetSessions";
import { useSessionStore } from "@features/pokerPlanning/sessionDetails/useSessionStore";
import { StyledButton } from "@pages/Project/ProjectDashboardPage/ProjectDashboardPage.style";


export const ProjectSessionsList = () => {
    const { projectKey } = useParams<{ projectKey: string }>();
    const { data: sessions, isLoading, error: queryError } = useGetSessions(projectKey ?? "");
    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state as LocationState | null;
    const passedProjectId = state?.projectId ?? 0;
    const passedProjectKey = state?.projectKey ?? "N/A";
    const isDeveloper = state?.isDeveloper ?? false;

    const { setActiveSessionId } = useSessionStore();

    const handleCardClick = (sessionId: number) => {
        setActiveSessionId(sessionId);
        void navigate(`/sessions/${sessionId}`, { state: projectKey});
    };

    const getStatusChip = (status: number) => {
        switch (status) {
            case 1: return <Chip label="Created" color="primary" size="small" />;
            case 2: return <Chip label="Running" color="success" size="small" />;
            case 3: return <Chip label="Finished" color="error" size="small" />;
            default: return <Chip label="Unknown" size="small" />;
        }
    };

    if (isLoading) return <CircularProgress />;

    if (queryError) {
        return <Typography color="error" textAlign="center">
            {queryError instanceof Error ? queryError.message : "An unexpected error occurred"}
        </Typography>;
    }

    return (
        <Box padding={3} display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography variant="h3">
                    Project Key: {projectKey}
                </Typography>
                {!isDeveloper && (<StyledButton
                    variant="contained"
                    onClick={() => {
                        void navigate("/sessions/create", {
                            state: { projectId: passedProjectId, projectKey: passedProjectKey }
                        });
                    }}
                >
                    Create new Session
                </StyledButton>)}
            </Box>
            <Divider />

            {sessions?.length === 0 && (
                <Paper sx={{ padding: 4, textAlign: 'center', borderRadius: 4 }}>
                    <Typography color="text.secondary">No sessions found.</Typography>
                </Paper>
            )}


            <Grid2 container spacing={3}>
                {sessions?.map((session) => (
                    <Grid2 key={session.id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                            elevation={2}
                            onClick={() => handleCardClick(session.id)}
                            sx={{
                                height: '100%',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                            }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                    <Typography variant="subtitle1">
                                        {session.title}
                                    </Typography>
                                    {getStatusChip(session.status)}
                                </Stack>

                                <Typography variant="body2" color="text.secondary" sx={{
                                    height: 64,
                                    overflowY: 'auto',
                                }}>
                                    {session.description}
                                </Typography>

                                <Stack direction="row" spacing={3} justifyContent={'space-between'}>
                                    <Typography variant="caption" fontWeight="medium">
                                        Duration: {Math.floor(session.duration / 60)} min
                                    </Typography>

                                    {session.started_at && (
                                        <Typography variant="caption" fontWeight="medium">
                                            Started at: {new Date(session.started_at).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>

        </Box >
    );
};