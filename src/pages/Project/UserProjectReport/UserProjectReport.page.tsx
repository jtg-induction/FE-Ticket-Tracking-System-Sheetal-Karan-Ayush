import React, { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
    Assignment,
    CheckCircleOutline,
    EventAvailable,
    EventBusy,
    Logout,
    PendingOutlined,
    PictureAsPdf,
    Refresh,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid2,
    MenuItem,
    Paper,
    TableCell,
    TableHead,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import { ChartCard } from '@components';
import { useAuthStore } from '@features/auth';
import { useUserReport } from '@features/user';
import { useUserBasicDetails } from '@features/user/useUserBasicDetails';
import { useUserReportPdf } from '@features/user/useUserPDFGenerate';

import { mapTicket } from './userProjectReport.config';
import {
    ActionButtonsContainer,
    DeadlineCell,
    HeaderContainer,
    LoadMoreButton,
    LoadMoreContainer,
    PageContainer,
    PriorityCell,
    SectionTitle,
    StatusCell,
    StyledTable,
    StyledTableBody,
    StyledTableContainer,
    StyledTableRow,
    SummaryCard,
    TicketTitle,
    TitleCell,
    UserInfoCard,
} from './UserProjectReport.style';
import { RawTicket, UserReportFilters } from './UserProjectReport.type';

const SummaryCardItem: React.FC<{
    label: string;
    value: number;
    icon?: React.ReactNode;
}> = ({ label, value, icon }) => (
    <SummaryCard>
        {icon && (
            <Box
                component="span"
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
            >
                {icon}
            </Box>
        )}
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="textSecondary">
            {label}
        </Typography>
    </SummaryCard>
);

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20];

export const UserReportPage: React.FC = () => {
    const [filters, setFilters] = useState<UserReportFilters>({
        status: [],
        priority: [],
        ticketType: [],
        limit: 5,
        sort: 'latest',
        createdFrom: undefined,
        createdTo: undefined,
        deadlineFrom: undefined,
        deadlineTo: undefined,
    });
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(0);
    const { data: userData, isLoading: userLoading } = useUserBasicDetails();

    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const { projectKey } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') ?? userData?.email;
    const {
        data: reportData,
        isLoading,
        isError,
        error,
    } = useUserReport(email, filters, cursor, projectKey);

    const { downloadPdf, isLoading: isPdfLoading } = useUserReportPdf();

    useEffect(() => {
        setCursor(undefined);
        setPage(0);
    }, [filters]);

    if (!user) {
        return (
            <PageContainer>
                <Alert severity="warning">
                    Please log in to view the report.
                </Alert>
            </PageContainer>
        );
    }

    if (userLoading || (isLoading && !reportData)) {
        return (
            <PageContainer
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </PageContainer>
        );
    }

    if (isError) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        return (
            <PageContainer>
                <Alert severity="error">
                    Failed to load report: {errorMessage}
                </Alert>
            </PageContainer>
        );
    }

    const summary = reportData!.summary ?? {
        totalTickets: 0,
        completedTickets: 0,
        pendingTickets: 0,
        deadlinesMet: 0,
        deadlinesMissed: 0,
    };

    const rawTickets: RawTicket[] = reportData!.tickets ?? [];
    const tickets = rawTickets.map(mapTicket);
    const nextCursor = reportData!.next_cursor;

    const handleMultiSelectChange =
        (field: keyof UserReportFilters) =>
        (event: React.ChangeEvent<{ value: unknown }>) => {
            setFilters((prev) => ({
                ...prev,
                [field]: event.target.value as string[],
            }));
        };

    const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({
            ...prev,
            limit: parseInt(event.target.value, 10),
        }));
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({
            ...prev,
            sort: event.target.value as 'latest' | 'oldest',
        }));
    };

    const handleLoadMore = () => {
        if (nextCursor) {
            setCursor(nextCursor);
            setPage((prev) => prev + 1);
        }
    };

    const handleReset = () => {
        setCursor(undefined);
        setPage(0);
        setFilters({
            status: [],
            priority: [],
            ticketType: [],
            limit: 5,
            sort: 'latest',
            createdFrom: undefined,
            createdTo: undefined,
            deadlineFrom: undefined,
            deadlineTo: undefined,
        });
    };

    const handlePdfDownload = () => {
        if (!userData?.email) return;
        downloadPdf({ filters, email: userData.email, projectKey });
    };

    const handleLogout = () => {
        clearAuth();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        void navigate('/login');
    };

    return (
        <PageContainer>
            <HeaderContainer>
                <SectionTitle variant="h4">User Report</SectionTitle>
                <ActionButtonsContainer>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PictureAsPdf />}
                        onClick={handlePdfDownload}
                        disabled={isPdfLoading}
                    >
                        {isPdfLoading ? 'Generating...' : 'Download PDF'}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </ActionButtonsContainer>
            </HeaderContainer>

            {/* User Information */}
            <SectionTitle variant="h5">User Information</SectionTitle>
            <Divider sx={{ mb: 2 }} />
            <UserInfoCard>
                <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="body1">
                            <strong>Name:</strong> {userData?.name || 'N/A'}
                        </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="body1">
                            <strong>Email:</strong> {userData?.email || 'N/A'}
                        </Typography>
                    </Grid2>
                </Grid2>
            </UserInfoCard>

            <Divider sx={{ my: 3 }} />

            {/* Summary Cards */}
            <SectionTitle variant="h5">Summary</SectionTitle>
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <SummaryCardItem
                        label="Total Tickets"
                        value={summary.totalTickets}
                        icon={<Assignment color="primary" />}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <SummaryCardItem
                        label="Completed"
                        value={summary.completedTickets}
                        icon={<CheckCircleOutline color="success" />}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <SummaryCardItem
                        label="Pending"
                        value={summary.pendingTickets}
                        icon={<PendingOutlined color="warning" />}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <SummaryCardItem
                        label="Deadlines Met"
                        value={summary.deadlinesMet}
                        icon={<EventAvailable color="info" />}
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                    <SummaryCardItem
                        label="Deadlines Missed"
                        value={summary.deadlinesMissed}
                        icon={<EventBusy color="error" />}
                    />
                </Grid2>
            </Grid2>

            <Divider sx={{ my: 3 }} />

            {/* Charts */}
            <SectionTitle variant="h5">Charts</SectionTitle>
            <Grid2 container spacing={2} sx={{ mb: 3 }}>
                {reportData?.charts?.deadline && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <ChartCard
                            title="Deadlines"
                            type="pie"
                            data={reportData.charts.deadline}
                            dataKey="value"
                            xKey="label"
                        />
                    </Grid2>
                )}
                {reportData?.charts?.priority && (
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                        <ChartCard
                            title="Ticket Priority"
                            type="pie"
                            data={reportData.charts.priority}
                            dataKey="value"
                            xKey="label"
                        />
                    </Grid2>
                )}
            </Grid2>

            <Divider sx={{ my: 3 }} />

            {/* Filters */}
            <Grid2 container spacing={2} sx={{ mb: 2 }}>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        select
                        label="Status"
                        value={filters.status}
                        onChange={handleMultiSelectChange('status')}
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) =>
                                (selected as string[]).join(', '),
                        }}
                        size="small"
                    >
                        <MenuItem value="Open">Open</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Resolved">Resolved</MenuItem>
                        <MenuItem value="Deleted">Deleted</MenuItem>
                    </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        select
                        label="Priority"
                        value={filters.priority}
                        onChange={handleMultiSelectChange('priority')}
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) =>
                                (selected as string[]).join(', '),
                        }}
                        size="small"
                    >
                        <MenuItem value="High">High</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Low">Low</MenuItem>
                    </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        select
                        label="Ticket Type"
                        value={filters.ticketType}
                        onChange={handleMultiSelectChange('ticketType')}
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) =>
                                (selected as string[]).join(', '),
                        }}
                        size="small"
                    >
                        <MenuItem value="Task">Task</MenuItem>
                        <MenuItem value="Bug">Bug</MenuItem>
                        <MenuItem value="Story">Story</MenuItem>
                        <MenuItem value="Epic">Epic</MenuItem>
                        <MenuItem value="Sub Task">Sub Task</MenuItem>
                    </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                    <TextField
                        fullWidth
                        select
                        label="Limit"
                        value={filters.limit}
                        onChange={handleLimitChange}
                        size="small"
                    >
                        {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 1 }}>
                    <TextField
                        fullWidth
                        select
                        label="Sort"
                        value={filters.sort}
                        onChange={handleSortChange}
                        size="small"
                    >
                        <MenuItem value="latest">Latest</MenuItem>
                        <MenuItem value="oldest">Oldest</MenuItem>
                    </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Created From"
                        value={filters.createdFrom || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                createdFrom: e.target.value,
                            }))
                        }
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Created To"
                        value={filters.createdTo || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                createdTo: e.target.value,
                            }))
                        }
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Deadline From"
                        value={filters.deadlineFrom || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                deadlineFrom: e.target.value,
                            }))
                        }
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Deadline To"
                        value={filters.deadlineTo || ''}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                deadlineTo: e.target.value,
                            }))
                        }
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                </Grid2>
            </Grid2>

            <Divider sx={{ my: 2 }} />
            <SectionTitle variant="h5">Tickets</SectionTitle>
            <Paper elevation={0} sx={{ overflowX: 'auto' }}>
                <StyledTableContainer>
                    <StyledTable sx={{ minWidth: 650 }}>
                        <TableHead>
                            <StyledTableRow>
                                <TitleCell>Title</TitleCell>
                                <StatusCell>Status</StatusCell>
                                <PriorityCell>Priority</PriorityCell>
                                <DeadlineCell>Deadline</DeadlineCell>
                            </StyledTableRow>
                        </TableHead>
                        <StyledTableBody>
                            {tickets.length === 0 ? (
                                <StyledTableRow>
                                    <TableCell colSpan={4} align="center">
                                        No tickets found
                                    </TableCell>
                                </StyledTableRow>
                            ) : (
                                tickets.map((ticket) => (
                                    <StyledTableRow key={ticket.id}>
                                        <TableCell>
                                            <Tooltip title={ticket.title} arrow>
                                                <TicketTitle variant="body2">
                                                    {ticket.title}
                                                </TicketTitle>
                                            </Tooltip>
                                        </TableCell>
                                        <StatusCell>{ticket.status}</StatusCell>
                                        <PriorityCell>
                                            {ticket.priority}
                                        </PriorityCell>
                                        <DeadlineCell>
                                            {ticket.deadline
                                                ? new Date(
                                                      ticket.deadline,
                                                  ).toLocaleDateString()
                                                : '—'}
                                        </DeadlineCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </StyledTableBody>
                    </StyledTable>
                </StyledTableContainer>
            </Paper>

            <LoadMoreContainer>
                <Typography variant="body2" color="textSecondary">
                    Page {page + 1}
                </Typography>
                <LoadMoreButton
                    variant="contained"
                    onClick={handleLoadMore}
                    disabled={!nextCursor || isLoading}
                >
                    {isLoading
                        ? 'Loading...'
                        : nextCursor
                          ? 'Load More'
                          : 'No More'}
                </LoadMoreButton>
            </LoadMoreContainer>
        </PageContainer>
    );
};
