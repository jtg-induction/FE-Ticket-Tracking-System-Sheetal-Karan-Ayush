import { useState } from 'react';

import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
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
import { importTicketRequestSchema } from '@features/ticket/importTicket/importTicket.schema';
import { useImportTicketMutation } from '@features/ticket/importTicket/useImportTicket';
import { StyledErrorTextField } from '@pages/Register/Register.styles';
import { TicketConstToStatusMap } from '@pages/TicketDetails/TicketDetails.util';
import { theme } from '@theme';

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
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [importTicketKeys, setImportTicketKeys] = useState<string[]>([]);
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
        (filterType == 'JQL'),
        (filterType != 'JQL') ?  
        {
            ...filters,
            deadline: filters.deadline ? filters.deadline.toISOString() : undefined,
            limit: 10,
        } : undefined,
        (filterType == 'JQL') ?  
        {
            jql: jqlQuery,
            limit: 10,
        } : undefined,
    );

    const handleImportKeyDelete = (key: string) => {
        setImportTicketKeys(prev => prev.filter(k => k !== key));
    };

    const addTicketKey = (value: string) => {
        const key = value.trim();
        if (!key) return;

        if (importTicketKeys.includes(key)) return;

        setImportTicketKeys(prev => [...prev, key]);
    };

    const [inputTicketKeyValue, setInputTicketKeyValue] = useState<string>('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTicketKey(inputTicketKeyValue);
            setInputTicketKeyValue("");
        }
    };

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

    const [importError, setImportError] = useState<string>('');

    const handleImportTicket = () => {
        const requestData = {
            projectKey: projectKey,
            ticketKey: importTicketKeys,
        };
        const result = importTicketRequestSchema.safeParse(requestData);

        if (!result.success) {
            const fieldError = result.error.issues[0].message
            setImportError(fieldError);
            return;
        }

        importTicketMutation.mutate(result.data);
    };

    // New state for filter type (JQL or Custom)
    
    const handleJqlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setJqlQuery(event.target.value);
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
                            label={project?.status === 2 ? 'Archived' : 'Active'}
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
                    <Typography variant="body2">{project?.description}</Typography>
                </StyledLowerBox>
            </StyledHeader>
            <Divider />

            <SectionLayout>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, 
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 2,
                    width: '100%'
                }}>
                    <FormControl variant="outlined" sx={{ minWidth: 120, marginBottom: 2, marginRight: 2 }}>
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

                    {filterType === 'JQL' ? ( <>
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
                                                <Typography variant="subtitle1" color="text.primary">
                                                    {headerCell.title}
                                                </Typography>
                                            </DesktopTableCell>
                                        );
                                    }
                                    return (
                                        <TableCell key={idx}>
                                            <Typography variant="subtitle1" color="text.primary">
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
                                        Error loading tickets. Please try again later.
                                    </TableCell>
                                </TableRow>
                            ) : data?.pages?.length? (
                                data.pages
                                    .flatMap((page) => page.tickets)
                                    .map((ticket) => (
                                        <TableRow
                                            key={ticket.id}
                                            onClick={() => {
                                                void navigate(`ticket/${ticket.jira_ticket_key}`);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {ticket.title}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {ticket.assignee}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {ticket.deadline
                                                        ? dayjs(ticket.deadline).format('MMM DD, YYYY')
                                                        : 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {TicketConstToStatusMap[ticket.status]}
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
                        <Button variant="outlined" onClick={() => void fetchNextPage()} disabled={isLoading}>
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
                                        const newStatus = e.target.checked ? 2 : 1;
                                        setUpdateFormData({
                                            status: newStatus,
                                        });
                                    }}
                                    color="error"
                                />
                            }
                            label={updateFormData?.status === 2 ? 'Archived' : 'Active'}
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
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                        {importTicketKeys.map((key) => (
                            <Chip
                                key={key}
                                label={key}
                                onDelete={() => handleImportKeyDelete(key)}
                                sx={{mb: 2}}
                            />
                        ))}

                        {importTicketKeys.length <= 10 && 
                            <StyledErrorTextField
                                variant="outlined"
                                placeholder="Type ticket key and press Enter"
                                value={inputTicketKeyValue}
                                onChange={(e) => setInputTicketKeyValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                sx={{width:"100%"}}
                                error={!!importError}
                                helperText={importError}
                            />
                        }
                    </Box>
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
