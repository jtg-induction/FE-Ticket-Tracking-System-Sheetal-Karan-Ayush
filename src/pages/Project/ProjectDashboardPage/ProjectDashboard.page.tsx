import { useEffect, useMemo, useState } from 'react';

import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Badge,
    Box,
    Divider,
    FormControlLabel,
    Switch,
    TableCell,
    TableHead,
    TablePagination,
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
import { InviteUser } from '@containers/InviteUser';
import {
    useDeleteProject,
    useGetProject,
    useProjectStore,
    useUpdateProject,
} from '@features/project';

import {
    ROW_PER_PAGE_OPTIONS,
    TICKET_TABLE_HEADER,
    ticketData,
} from './ProjectDashboard.config';
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
        title: '',
        assignee: '',
        deadline: null,
        status: '',
        sort: 'latest',
    };
    const navigate = useNavigate();
    const { projectKey } = useParams<{ projectKey: string }>();
    const { data: project, isError } = useGetProject(projectKey);
    const isDeveloper = project?.role === 2;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const { mutate: updateProject } = useUpdateProject();
    const { mutate: deleteProject } = useDeleteProject();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [isInviteUserOpen, setIsInviteUserOpen] = useState(false);
    const [filters, setFilters] = useState(defaultFilters);

    const handleFilterChange = (
        field: keyof Filters,
        value: string | dayjs.Dayjs | null,
    ) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(Number.parseInt(event.target.value, 10));
        setPage(0);
    };
    useEffect(() => {
        if (isError) {
            void navigate('/*')
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

    const filteredTickets = useMemo(() => {
        const filtered = ticketData.filter((ticket) => {
            const matchesTitle = ticket.title
                .toLowerCase()
                .includes(filters.title.toLowerCase());

            const matchesAssignee = ticket.assignee
                .toLowerCase()
                .includes(filters.assignee.toLowerCase());

            const matchesStatus = filters.status
                ? ticket.Status === filters.status
                : true;

            const matchesDeadline = filters.deadline
                ? dayjs(ticket.Deadline).isSame(filters.deadline, 'day')
                : true;

            return (
                matchesTitle &&
                matchesAssignee &&
                matchesStatus &&
                matchesDeadline
            );
        });

        filtered.sort((a, b) => {
            const dateA = dayjs(a.Deadline);
            const dateB = dayjs(b.Deadline);

            if (filters.sort === 'latest') {
                return dateB.valueOf() - dateA.valueOf();
            }
            return dateA.valueOf() - dateB.valueOf();
        });

        return filtered;
    }, [filters]);

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
                            <StyledButton variant="contained">
                                Import ticket
                            </StyledButton>
                            <StyledButton variant="contained">
                                Create ticket
                            </StyledButton>
                            <StyledButton variant="contained" onClick={() => setIsInviteUserOpen(true)}>
                                Invite user
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
                                                    color="text.secondary"
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
                                                color="text.secondary"
                                            >
                                                {headerCell.title}
                                            </Typography>
                                        </TableCell>
                                    );
                                })}
                            </StyledTableRow>
                        </TableHead>
                        <StyledTableBody>
                            {filteredTickets?.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell component="th" scope="row">
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
                                            {ticket.Deadline}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {ticket.Status}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </StyledTableBody>
                    </StyledTable>
                    <TablePagination
                        rowsPerPageOptions={ROW_PER_PAGE_OPTIONS}
                        component="div"
                        count={filteredTickets?.length ?? 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </StyledTableContainer>
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
                <InviteUser open={isInviteUserOpen} setOpen={setIsInviteUserOpen} projectId={Number(project?.id)} projectKey={projectKey ?? ""}/>
            </SectionLayout>
        </>
    );
};
