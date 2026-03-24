import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import UserSidebarIcon from '@mui/icons-material/PeopleAlt';
import {
    Badge,
    Box,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Grid2,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import {
    ChartCard,
    ClampedTooltipText,
    DialogBox,
    Filters,
    ProjectTicketFilters,
    SectionLayout,
} from '@components';
import { UserSidebar } from '@containers/UsersList/UsersList.container';
import {
    useDeleteProject,
    useGetProject,
    useProjectStore,
    useTicketDeadlineStats,
    useTicketPriorityStats,
    useTicketStatusStats,
    useUpdateProject,
} from '@features/project';
import { useGetAllTickets } from '@features/ticket/getAllTickets/usegetAllTickets';
import { importTicketRequestSchema } from '@features/ticket/importTicket/importTicket.schema';
import { useImportTicketMutation } from '@features/ticket/importTicket/useImportTicket';
import { StyledErrorTextField } from '@pages/Register/Register.styles';
import { TicketConstToStatusMap } from '@pages/TicketDetails/TicketDetails.util';
import { theme } from '@theme';

import { TICKET_TABLE_HEADER } from './ProjectDashboard.config';
import {
    ChartLoadingContainer,
    ChartNoDataContainer,
    DeleteIcon,
    DesktopTableCell,
    EditIcon,
    IconBox,
    LineChartLoadingContainer,
    LineChartNoDataContainer,
    StatusBadge,
    StyledButton,
    StyledHeader,
    StyledLeftBox,
    StyledLowerBox,
    StyledRightBox,
    StyledTable,
    StyledTableBody,
    StyledTableContainer,
    StyledTableRow,
    StyledUpperBox,
} from './ProjectDashboardPage.style';

export const ProjectDashboardPage = () => {
    const {
        setDeleteTarget,
        deleteTarget,
        clearDeleteTarget,
        updateFormData,
        setUpdateFormData,
    } = useProjectStore();

    const defaultFilters = {
        title: undefined,
        assignee: undefined,
        deadline: undefined,
        status: undefined,
        sort: 'latest',
    };
    const navigate = useNavigate();
    const { projectKey } = useParams<{ projectKey: string }>();
    const { data: project, isError } = useGetProject(projectKey);
    const isDeveloper = project?.role === 2;

    const { mutate: updateProject } = useUpdateProject();
    const { mutate: deleteProject } = useDeleteProject();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [importTicketKey, setImportTicketKey] = useState('');
    const importTicketMutation = useImportTicketMutation();

    const handleFilterChange = (
        field: keyof Filters,
        value: string | dayjs.Dayjs | null,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const [filterType, setFilterType] = useState('Custom');
    const [jqlQuery, setJqlQuery] = useState('');

    const { data, fetchNextPage, hasNextPage, isLoading } = useGetAllTickets(
        projectKey as string,
        filterType == 'JQL',
        filterType != 'JQL'
            ? {
                  ...filters,
                  deadline: filters.deadline
                      ? filters.deadline.toISOString()
                      : undefined,
                  limit: 10,
              }
            : undefined,
        filterType == 'JQL'
            ? {
                  jql: jqlQuery,
                  limit: 10,
              }
            : undefined,
    );

    const [userSidebarOpen, setUserSidebarOpen] = useState(false);

    useEffect(() => {
        if (isError) {
            void navigate('/*');
        }
    }, [isError, navigate]);
    const handleOpenProjectDialog = () => {
        if (project) {
            setUpdateFormData({
                title: project.title,
                description: project.description || '',
                status: project.status,
            });
        }
        setIsProjectDialogOpen(true);
    };

    const handleReset = () => {
        setFilters(defaultFilters);
    };

    const handleUpdateProject = () => {
        if (!project) return;
        const statusValue = Number(updateFormData.status) || 1;
        updateProject({
            jira_project_key: project.jira_project_key,
            data: {
                title: updateFormData.title || '',
                description: updateFormData.description || '',
                status: statusValue,
            },
        });
        setIsProjectDialogOpen(false);
    };

    const handleDeleteProject = () => {
        if (!deleteTarget) return;
        deleteProject(deleteTarget.jira_project_key);
        setIsDeleteDialogOpen(false);
        clearDeleteTarget();
    };
    const { data: statusCounts, isLoading: statusLoading } =
        useTicketStatusStats(projectKey);
    const { data: priorityCounts, isLoading: priorityLoading } =
        useTicketPriorityStats(projectKey);
    const { data: deadlineCounts, isLoading: deadlineLoading } =
        useTicketDeadlineStats(projectKey);

    const [importErrors, setImportErrors] = useState<Record<string, string>>(
        {},
    );

    const handleImportTicket = () => {
        const requestData = {
            projectKey: projectKey,
            ticketKey: importTicketKey,
        };
        const result = importTicketRequestSchema.safeParse(requestData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            setImportErrors(fieldErrors);
            return;
        }

        importTicketMutation.mutate(result.data);
    };

    // New state for filter type (JQL or Custom)

    const handleJqlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setJqlQuery(event.target.value);
    };

    const statusChartData = useMemo(() => {
        if (!statusCounts) return null;
        return statusCounts.map((item) => ({
            status: item.status,
            count: item.count,
        }));
    }, [statusCounts]);

    const priorityChartData = useMemo(() => {
        if (!priorityCounts) return null;
        return priorityCounts.map((item) => ({
            priority: item.priority,
            count: item.count,
        }));
    }, [priorityCounts]);
    const deadlineChartData = useMemo(() => {
        if (!deadlineCounts) return [];

        return deadlineCounts
            .map((item) => {
                const dayDiff = Number(item.day_difference);
                if (isNaN(dayDiff)) return null;
                return {
                    day_difference: dayDiff,
                    count: item.count ?? 0,
                };
            })
            .filter(Boolean) 
            .sort((a, b) => a.day_difference - b.day_difference);
    }, [deadlineCounts]);
    const hasData = deadlineChartData && deadlineChartData.length > 0;
  
    return (
        <>
            <StyledHeader>
                <StyledUpperBox>
                    <StyledLeftBox>
                        <ClampedTooltipText variant="h2" lines={2}>
                            {project?.title}
                        </ClampedTooltipText>
                        <StatusBadge
                            label={
                                project?.status === 2 ? 'Archived' : 'Active'
                            }
                            ownerState={{
                                archived: project?.status === 2,
                            }}
                        />
                        {!isDeveloper && (
                            <IconBox>
                                <IconBox>
                                    <EditIcon
                                        onClick={handleOpenProjectDialog}
                                    />
                                    <DeleteIcon
                                        onClick={() => {
                                            if (project) {
                                                setDeleteTarget(project);
                                                setIsDeleteDialogOpen(true);
                                            }
                                        }}
                                    />
                                </IconBox>
                            </IconBox>
                        )}
                        <Badge />
                    </StyledLeftBox>

                    <StyledRightBox>
                        {!isDeveloper && project?.status !== 2 && (
                            <>
                                <StyledButton
                                    variant="contained"
                                    onClick={() => setIsImportDialogOpen(true)}
                                >
                                    Import ticket
                                </StyledButton>
                                <StyledButton
                                    variant="contained"
                                    onClick={() =>
                                        void navigate('ticket/create')
                                    }
                                >
                                    Create ticket
                                </StyledButton>
                            </>
                        )}
                        <StyledButton
                            onClick={() => setUserSidebarOpen((prev) => !prev)}
                        >
                            <UserSidebarIcon />
                        </StyledButton>
                    </StyledRightBox>
                </StyledUpperBox>
                <StyledLowerBox>
                    <Typography variant="body2">
                        {project?.description}
                    </Typography>
                </StyledLowerBox>
            </StyledHeader>
            <Divider />

            <SectionLayout>
                <UserSidebar
                    open={userSidebarOpen}
                    onClose={() => setUserSidebarOpen(false)}
                />
                <Grid2 container spacing={3} sx={{ mt: 1 }}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        {statusLoading ? (
                            <ChartLoadingContainer>
                                <CircularProgress />
                            </ChartLoadingContainer>
                        ) : statusChartData ? (
                            <ChartCard
                                title="Ticket by Status"
                                type="pie"
                                data={statusChartData}
                                dataKey="count"
                                xKey="status"
                            />
                        ) : (
                            <ChartNoDataContainer>
                                <Typography color="textSecondary">
                                    No data available
                                </Typography>
                            </ChartNoDataContainer>
                        )}
                    </Grid2>

                    <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                        {priorityLoading ? (
                            <ChartLoadingContainer>
                                <CircularProgress />
                            </ChartLoadingContainer>
                        ) : priorityChartData ? (
                            <ChartCard
                                title="Ticket by Priority"
                                type="pie"
                                data={priorityChartData}
                                dataKey="count"
                                xKey="priority"
                            />
                        ) : (
                            <ChartNoDataContainer>
                                <Typography color="textSecondary">
                                    No data available
                                </Typography>
                            </ChartNoDataContainer>
                        )}
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 16 }}>
                        {deadlineLoading ? (
                            <LineChartLoadingContainer>
                                <CircularProgress />
                            </LineChartLoadingContainer>
                        ) : hasData ? (
                            <ChartCard
                                title="Ticket Deadline Performance"
                                type="line"
                                data={deadlineChartData}
                                dataKey="count"
                                xKey="day_difference"
                                xAxisLabel="Days difference (negative = early, positive = late)"
                            />
                        ) : (
                            <LineChartNoDataContainer>
                                <Typography color="textSecondary">
                                    No deadline data available
                                </Typography>
                            </LineChartNoDataContainer>
                        )}
                    </Grid2>
                </Grid2>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 2,
                        width: '100%',
                    }}
                >
                    <FormControl
                        variant="outlined"
                        sx={{ minWidth: 120, marginBottom: 2, marginRight: 2 }}
                    >
                        <InputLabel>Filter Type</InputLabel>
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            label="Filter Type"
                        >
                            <MenuItem value="Custom">Custom</MenuItem>
                            <MenuItem value="JQL">JQL</MenuItem>
                        </Select>
                    </FormControl>

                    {filterType === 'JQL' ? (
                        <>
                            <TextField
                                label="Enter JQL(Project Key is pre included)"
                                variant="outlined"
                                fullWidth
                                value={jqlQuery}
                                onChange={handleJqlChange}
                                sx={{
                                    marginBottom: 2,
                                    minWidth: theme.spacing(75),
                                    maxWidth: theme.spacing(200),
                                }}
                            />
                        </>
                    ) : (
                        <ProjectTicketFilters
                            filters={filters}
                            onChange={handleFilterChange}
                            onReset={handleReset}
                        />
                    )}
                </Box>

                <StyledTableContainer>
                    <StyledTable aria-label="Ticket table">
                        <TableHead>
                            <StyledTableRow>
                                {TICKET_TABLE_HEADER.map((headerCell, idx) => {
                                    if (headerCell.isHiddenInMobile) {
                                        return (
                                            <DesktopTableCell key={idx}>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="text.primary"
                                                >
                                                    {headerCell.title}
                                                </Typography>
                                            </DesktopTableCell>
                                        );
                                    }
                                    return (
                                        <TableCell key={idx}>
                                            <Typography
                                                variant="subtitle1"
                                                color="text.primary"
                                            >
                                                {headerCell.title}
                                            </Typography>
                                        </TableCell>
                                    );
                                })}
                            </StyledTableRow>
                        </TableHead>
                        <StyledTableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Loading tickets...
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Error loading tickets. Please try again
                                        later.
                                    </TableCell>
                                </TableRow>
                            ) : data?.pages?.length ? (
                                data.pages
                                    .flatMap((page) => page.tickets)
                                    .map((ticket) => (
                                        <TableRow
                                            key={ticket.id}
                                            onClick={() => {
                                                void navigate(
                                                    `ticket/${ticket.jira_ticket_key}`,
                                                );
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {ticket.title}
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {ticket.assignee}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {ticket.deadline
                                                        ? dayjs(
                                                              ticket.deadline,
                                                          ).format(
                                                              'MMM DD, YYYY',
                                                          )
                                                        : 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {
                                                        TicketConstToStatusMap[
                                                            ticket.status
                                                        ]
                                                    }
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No tickets available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </StyledTableBody>
                    </StyledTable>
                </StyledTableContainer>

                {/* Load More Button */}
                {hasNextPage && (
                    <Box display="flex" my={2}>
                        <Button
                            variant="outlined"
                            onClick={() => void fetchNextPage()}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Load More'}
                        </Button>
                    </Box>
                )}
                {/* Dialogs for Project Update and Delete */}
                <DialogBox
                    open={isProjectDialogOpen}
                    title="Edit Project"
                    onClose={() => setIsProjectDialogOpen(false)}
                    onSubmit={handleUpdateProject}
                >
                    {project?.status == 1 && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Project Title"
                                value={updateFormData?.title}
                                onChange={(e) =>
                                    setUpdateFormData({ title: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Project Description"
                                multiline
                                rows={4}
                                value={updateFormData?.description}
                                onChange={(e) =>
                                    setUpdateFormData({
                                        description: e.target.value,
                                    })
                                }
                            />
                        </>
                    )}
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={updateFormData?.status === 2}
                                    onChange={(e) => {
                                        const newStatus = e.target.checked
                                            ? 2
                                            : 1;
                                        setUpdateFormData({
                                            status: newStatus,
                                        });
                                    }}
                                    color="error"
                                />
                            }
                            label={
                                updateFormData?.status === 2
                                    ? 'Archived'
                                    : 'Active'
                            }
                        />
                    </Box>
                </DialogBox>
                <DialogBox
                    open={isDeleteDialogOpen}
                    title="Confirm Delete"
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onSubmit={handleDeleteProject}
                    submitText="Delete"
                    cancelText="Cancel"
                >
                    <Typography>Are you sure you want to delete?</Typography>
                </DialogBox>
                <DialogBox
                    open={isImportDialogOpen}
                    title="Import Ticket"
                    onClose={() => setIsImportDialogOpen(false)}
                    onSubmit={handleImportTicket}
                    submitText="Import"
                    cancelText="Cancel"
                >
                    <StyledErrorTextField
                        label="Jira Ticket Key"
                        variant="outlined"
                        fullWidth
                        value={importTicketKey}
                        onChange={(e) => {
                            setImportErrors({});
                            setImportTicketKey(e.target.value);
                        }}
                        sx={{ marginBottom: 2 }}
                        error={!!importErrors.ticketKey}
                        helperText={importErrors.ticketKey}
                    />
                    {importTicketMutation.isError && (
                        <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.error.contrastText }}
                        >
                            {importTicketMutation.error.message}
                        </Typography>
                    )}
                </DialogBox>
            </SectionLayout>
        </>
    );
};
