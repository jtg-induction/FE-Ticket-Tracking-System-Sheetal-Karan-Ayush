import { useMemo, useState } from 'react';

import dayjs from 'dayjs';

import {
    Divider,
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
    ProjectTicketFilters,
    SectionLayout,
} from '@components';

import { ROW_PER_PAGE_OPTIONS, TICKET_TABLE_HEADER, ticketData } from './ProjectDashboard.config';
import {
    DeleteIcon,
    DesktopTableCell,
    EditIcon,
    IconBox,
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
    const defaultFilters = {
        title: '',
        assignee: '',
        deadline: null,
        status: '',
        sort: 'latest',
    };
     const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<any>(null);
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
    const [project, setProject] = useState({
        title: 'Project Title',
        description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit...',
    });
    const [projectForm, setProjectForm] = useState(project);
    const [filters, setFilters] = useState(defaultFilters);
    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
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
    
    const handleOpenProjectDialog = () => {
        setProjectForm(project);
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
    return (
        <>
            <StyledHeader>
                <StyledUpperBox>
                    <StyledLeftBox>
                        <ClampedTooltipText variant="h2" lines={2}>
                            {project.title}
                        </ClampedTooltipText>
                        <IconBox>
                            <IconBox>
                                <EditIcon onClick={handleOpenProjectDialog} />
                                <DeleteIcon
                                    onClick={() => {
                                        setDeleteTarget(project);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                />
                            </IconBox>
                        </IconBox>
                    </StyledLeftBox>
                    <StyledRightBox>
                        <StyledButton variant="contained">
                            Import ticket
                        </StyledButton>
                        <StyledButton variant="contained">
                            Create ticket
                        </StyledButton>
                    </StyledRightBox>
                </StyledUpperBox>
                <StyledLowerBox>
                    <Typography variant="body2">
                        {project.description}
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
                        rowsPerPageOptions= {ROW_PER_PAGE_OPTIONS}
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
                    onSubmit={() => {
                        setProject(projectForm);
                        setIsProjectDialogOpen(false);
                    }}
                >
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Title"
                        value={projectForm.title}
                        onChange={(e) =>
                            setProjectForm({
                                ...projectForm,
                                title: e.target.value,
                            })
                        }
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Project Description"
                        multiline
                        rows={4}
                        value={projectForm.description}
                        onChange={(e) =>
                            setProjectForm({
                                ...projectForm,
                                description: e.target.value,
                            })
                        }
                    />
                </DialogBox>
                <DialogBox
                    open={isDeleteDialogOpen}
                    title="Confirm Delete"
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onSubmit={() => {
                        console.log('Deleting:', deleteTarget);
                        setIsDeleteDialogOpen(false);
                    }}
                    submitText="Delete"
                    cancelText="Cancel"
                >
                    <Typography>Are you sure you want to delete?</Typography>
                </DialogBox>
            </SectionLayout>
        </>
    );
};
