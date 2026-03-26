import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Alert,
    Box,
    Chip,
    Divider,
    FormControlLabel,
    Skeleton,
    Switch,
    TextField,
    Typography,
} from '@mui/material';

import {
    DialogBox,
    Filters,
    ProjectCharts,
    ProjectHeader,
    SectionLayout,
    TicketSection,
    useSnackbarStore,
} from '@components';
import { InviteUser } from '@containers/InviteUser';
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
import { useJqlSearchTickets } from '@features/ticket/jqlSearch/useJqlSearchTicket';
import { StyledErrorTextField } from '@pages/Register/Register.styles';
import { useQueryClient } from '@tanstack/react-query';
import { theme } from '@theme';

export const ProjectDashboardPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { projectKey } = useParams<{ projectKey: string }>();
    const { showSnackbar } = useSnackbarStore();


    // State
    const [filterType, setFilterType] = useState<'Custom' | 'JQL'>('Custom');
    const [jqlQuery, setJqlQuery] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [userSidebarOpen, setUserSidebarOpen] = useState(false);
    const [importError, setImportError] = useState<string>('');
    const [importTicketKeys, setImportTicketKeys] = useState<string[]>([]);
    const [inputTicketKeyValue, setInputTicketKeyValue] = useState<string>('');
    const [filters, setFilters] = useState<Filters>({
        title: undefined,
        assignee: undefined,
        deadline: null,
        status: undefined,
        sort: 'latest',
    });

    // Store
    const {
        setDeleteTarget,
        deleteTarget,
        clearDeleteTarget,
        updateFormData,
        setUpdateFormData,
    } = useProjectStore();

    // Project queries
    const {
        data: project,
        isPending: projectLoading,
        isError: projectIsError,
        error: projectError,
    } = useGetProject(projectKey);

    // Statistics
    const {
        data: statusCounts,
        isLoading: statusLoading,
        error: statusError,
    } = useTicketStatusStats(projectKey);
    const {
        data: priorityCounts,
        isLoading: priorityLoading,
        error: priorityError,
    } = useTicketPriorityStats(projectKey);
    const {
        data: deadlineCounts,
        isLoading: deadlineLoading,
        error: deadlineError,
    } = useTicketDeadlineStats(projectKey);

    useEffect(() => {
        if (statusError) {
            showSnackbar('Failed to load status statistics', 'error');
        }
    }, [statusError, showSnackbar]);

    useEffect(() => {
        if (priorityError) {
            showSnackbar('Failed to load priority statistics', 'error');
        }
    }, [priorityError, showSnackbar]);

    useEffect(() => {
        if (deadlineError) {
            showSnackbar('Failed to load deadline statistics', 'error');
        }
    }, [deadlineError, showSnackbar]);

    // Ticket queries (infinite)
    const getAllTickets = useGetAllTickets(
        projectKey as string,
        {
            ...filters,
            deadline: filters.deadline?.isValid()
                ? filters.deadline.toISOString()
                : undefined,
            limit: 10,
        },
        { enabled: filterType !== 'JQL' },
    );
    const jqlSearchTickets = useJqlSearchTickets(
        projectKey as string,
        { jql: jqlQuery, limit: 10 },
        { enabled: filterType === 'JQL' },
    );

    const {
        data: ticketsData,
        fetchNextPage,
        hasNextPage,
        isLoading: ticketsLoading,
        isError: ticketsError,
    } = filterType === 'JQL' ? jqlSearchTickets : getAllTickets;

    // Mutations
    const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
    const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
    const importTicketMutation = useImportTicketMutation();

    // Derived data
    const isDeveloper = project?.role === 2;

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
        if (!deadlineCounts) return null;
        return deadlineCounts.map((item) => ({
            day_difference: item.day_difference,
            count: item.count,
        }));
    }, [deadlineCounts]);

    // Effects
    useEffect(() => {
        if (filterType === 'JQL') {
            queryClient.removeQueries({
                queryKey: ['tickets', 'list', projectKey],
            });
        } else {
            queryClient.removeQueries({
                queryKey: ['tickets', 'jql', projectKey],
            });
        }
    }, [filterType, projectKey, queryClient]);

    useEffect(() => {
        if (projectIsError) {
            void navigate('/*');
        }
    }, [projectIsError, navigate]);

    // Handlers
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

    const handleUpdateProject = () => {
        if (!project) return;
        const statusValue = Number(updateFormData.status) || 1;
        updateProject(
            {
                jira_project_key: project.jira_project_key,
                data: {
                    title: updateFormData.title || '',
                    description: updateFormData.description || '',
                    status: statusValue,
                },
            },
            {
                onSuccess: () => {
                    showSnackbar('Project updated successfully', 'success');
                    setIsProjectDialogOpen(false);
                },
                onError: () => {
                    showSnackbar('Failed to update project', 'error');
                },
            },
        );
    };

    const handleDeleteProject = () => {
        if (!deleteTarget) return;
        deleteProject(deleteTarget.jira_project_key, {
            onSuccess: () => {
                showSnackbar('Project deleted successfully', 'success');
                setIsDeleteDialogOpen(false);
                clearDeleteTarget();
            },
            onError: () => {
                showSnackbar('Failed to delete project', 'error');
            },
        });
    };

    const handleImportTicket = () => {
        const requestData = { projectKey, ticketKey: importTicketKeys };
        const result = importTicketRequestSchema.safeParse(requestData);

        if (!result.success) {
            const fieldError = result.error.issues[0].message;
            setImportError(fieldError);
            return;
        }

        importTicketMutation.mutate(result.data, {
            onSuccess: (data) => {
                showSnackbar(
                    `${data.success_count} ticket(s) imported successfully`,
                    'success',
                );
                setIsImportDialogOpen(false);
                setImportTicketKeys([]);
                setInputTicketKeyValue('');
                setImportError('');
                void queryClient.invalidateQueries({
                    queryKey: ['tickets', 'list', projectKey],
                });
            },
            onError: (error) => {
                showSnackbar(`Import failed: ${error.message}`, 'error');
            },
        });
    };

    const handleImportKeyDelete = (key: string) => {
        setImportTicketKeys((prev) => prev.filter((k) => k !== key));
    };

    const addTicketKey = (value: string) => {
        const key = value.trim();
        if (!key) return;
        if (importTicketKeys.includes(key)) return;
        setImportTicketKeys((prev) => [...prev, key]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setImportError('');
        if (e.key === 'Enter') {
            e.preventDefault();
            addTicketKey(inputTicketKeyValue);
            setInputTicketKeyValue('');
        }
    };

    const handleFilterChange = (
        field: keyof Filters,
        value: string | dayjs.Dayjs | null,
    ) => {
        if (
            field === 'deadline' &&
            value &&
            !(value as dayjs.Dayjs).isValid()
        ) {
            showSnackbar('Invalid date entered, filter cleared', 'info');
            setFilters((prev) => ({ ...prev, deadline: null }));
            return;
        }
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            title: undefined,
            assignee: undefined,
            deadline: null,
            status: undefined,
            sort: 'latest',
        });
    };

    if (projectLoading) {
        return (
            <Box p={3}>
                <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={400} />
            </Box>
        );
    }

    if (projectIsError) {
        return (
            <Box p={3}>
                <Alert severity="error">
                    Failed to load project:{' '}
                    {projectError?.message || 'Unknown error'}
                </Alert>
            </Box>
        );
    }

    return (
        <>
            <ProjectHeader
                project={project}
                isDeveloper={isDeveloper}
                onEdit={handleOpenProjectDialog}
                onDelete={() => {
                    if (project) {
                        setDeleteTarget(project);
                        setIsDeleteDialogOpen(true);
                    }
                }}
                onImport={() => setIsImportDialogOpen(true)}
                onCreate={() => void navigate('ticket/create')}
                onDownload={() =>
                    void navigate(`/project/${projectKey}/reports/download`)
                }
                onToggleUsers={() => setUserSidebarOpen((prev) => !prev)}
                onInvite={() => setIsInviteDialogOpen(true)}
            />
            <Divider />
            <SectionLayout>
                <ProjectCharts
                    statusData={statusChartData}
                    statusLoading={statusLoading}
                    priorityData={priorityChartData}
                    priorityLoading={priorityLoading}
                    deadlineData={deadlineChartData}
                    deadlineLoading={deadlineLoading}
                />
                <UserSidebar
                    open={userSidebarOpen}
                    onClose={() => setUserSidebarOpen(false)}
                />
                <TicketSection
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    jqlQuery={jqlQuery}
                    onJqlChange={setJqlQuery}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    ticketsData={ticketsData}
                    isLoading={ticketsLoading}
                    isError={ticketsError}
                    hasNextPage={hasNextPage}
                    fetchNextPage={() => void fetchNextPage}
                    projectKey={projectKey || ''}
                />

                {/* Dialogs */}
                <DialogBox
                    open={isProjectDialogOpen}
                    title="Edit Project"
                    onClose={() => setIsProjectDialogOpen(false)}
                    onSubmit={handleUpdateProject}
                    submitText="Save"
                    cancelText="Cancel"
                    submitButtonDisabled={isUpdating}
                >
                    {project?.status === 1 && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Project Title"
                                value={updateFormData?.title}
                                onChange={(e) =>
                                    setUpdateFormData({ title: e.target.value })
                                }
                                required
                                error={!updateFormData?.title?.trim()}
                                helperText={
                                    !updateFormData?.title?.trim() &&
                                    'Title is required'
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
                    <Box mt={2}>
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
                    submitButtonDisabled={isDeleting}
                >
                    <Typography>
                        Are you sure you want to delete this project?
                    </Typography>
                </DialogBox>

                <DialogBox
                    open={isImportDialogOpen}
                    title="Import Ticket"
                    onClose={() => setIsImportDialogOpen(false)}
                    onSubmit={handleImportTicket}
                    submitText="Import"
                    cancelText="Cancel"
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 2,
                        }}
                    >
                        {importTicketKeys.map((key) => (
                            <Chip
                                key={key}
                                label={key}
                                onDelete={() => handleImportKeyDelete(key)}
                                sx={{ mb: 2 }}
                            />
                        ))}
                        {importTicketKeys.length <= 10 && (
                            <StyledErrorTextField
                                variant="outlined"
                                placeholder="Type ticket key and press Enter"
                                value={inputTicketKeyValue}
                                onChange={(e) =>
                                    setInputTicketKeyValue(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                sx={{ width: '100%' }}
                                error={!!importError}
                                helperText={importError}
                            />
                        )}
                    </Box>
                    {importTicketMutation.isError && (
                        <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.error.contrastText }}
                        >
                            {importTicketMutation.error.message}
                        </Typography>
                    )}
                    {importTicketMutation.isSuccess && (
                        <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.success.contrastText }}
                        >
                            {importTicketMutation.data.success_count} imported
                            Successfully
                        </Typography>
                    )}
                </DialogBox>

                <InviteUser
                    open={isInviteDialogOpen}
                    onClose={() => setIsInviteDialogOpen(false)}
                    projectId={project?.id}
                />
            </SectionLayout>
        </>
    );
};
