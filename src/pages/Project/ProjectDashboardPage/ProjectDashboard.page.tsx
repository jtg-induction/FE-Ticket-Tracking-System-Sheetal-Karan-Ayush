import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Badge,
    Box,
    Button,
    Divider,
    FormControlLabel,
    Switch,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import {
    ClampedTooltipText,
    DialogBox,
    Filters,
    ProjectTicketFilters,
    SectionLayout,
} from '@components';
import {
    useDeleteProject,
    useGetProject,
    useProjectStore,
    useUpdateProject,
} from '@features/project';
import { useGetAllTickets } from '@features/ticket/getAllTickets/usegetAllTickets'; // Custom hook
import { TicketConstToStatusMap } from '@pages/TicketDetails/TicketDetails.util';

import { TICKET_TABLE_HEADER } from './ProjectDashboard.config';
import {
    DeleteIcon,
    DesktopTableCell,
    EditIcon,
    IconBox,
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
    const [filters, setFilters] = useState(defaultFilters);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [importTicketKey, setImportTicketKey] = useState('');

    const handleFilterChange = (
        field: keyof Filters,
        value: string | dayjs.Dayjs | null,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const { data, fetchNextPage, hasNextPage, isLoading } = useGetAllTickets(
        projectKey as string,
        {
            sort: filters.sort,
            limit: 10,
            title: filters.title,
            status: filters.status,
            assignee: filters.assignee,
        },
    );

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
                    {!isDeveloper && (
                        <StyledRightBox>
                            <StyledButton
                                variant="contained"
                                onClick={() => setIsImportDialogOpen(true)}
                            >
                                Import ticket
                            </StyledButton>
                            <StyledButton
                                variant="contained"
                                onClick={() => void navigate('ticket/create')}
                            >
                                Create ticket
                            </StyledButton>
                        </StyledRightBox>
                    )}
                </StyledUpperBox>
                <StyledLowerBox>
                    <Typography variant="body2">
                        {project?.description}
                    </Typography>
                </StyledLowerBox>
            </StyledHeader>
            <Divider />
            <SectionLayout>
                <ProjectTicketFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={handleReset}
                />
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
                            ) : data?.pages?.length > 0 ? (
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
                    // onSubmit={handleImportTicket}
                    submitText="Import"
                    cancelText="Cancel"
                >
                    <TextField
                        label="Jira Ticket Key"
                        variant="outlined"
                        fullWidth
                        value={importTicketKey}
                        onChange={(e) => setImportTicketKey(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    {/* {ticketImportError && (
            <Typography color="error" variant="body2">
                {ticketImportError}
            </Typography>
            )} */}
                </DialogBox>
            </SectionLayout>
        </>
    );
};
