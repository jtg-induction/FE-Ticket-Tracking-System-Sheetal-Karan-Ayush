import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';

import { ProjectTicketFilters } from '@components';
import { TicketConstToStatusMap } from '@pages/TicketDetails/TicketDetails.util';

import { TicketSectionProps } from './ProjectTicket.type';
import { TICKET_TABLE_HEADER } from './ProjectTickets.config';
import {
    DesktopTableCell,
    StyledTable,
    StyledTableBody,
    StyledTableContainer,
    StyledTableRow,
} from './ProjectTickets.style';

export const TicketSection = ({
    filterType,
    onFilterTypeChange,
    jqlQuery,
    onJqlChange,
    filters,
    onFilterChange,
    onResetFilters,
    ticketsData,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    projectKey,
}: TicketSectionProps) => {
    const navigate = useNavigate();

    return (
        <>
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
                        onChange={(e) =>
                            onFilterTypeChange(
                                e.target.value as 'Custom' | 'JQL',
                            )
                        }
                        label="Filter Type"
                    >
                        <MenuItem value="Custom">Custom</MenuItem>
                        <MenuItem value="JQL">JQL</MenuItem>
                    </Select>
                </FormControl>

                {filterType === 'JQL' ? (
                    <TextField
                        label="Enter JQL(Project Key is pre included)"
                        variant="outlined"
                        fullWidth
                        value={jqlQuery}
                        onChange={(e) => onJqlChange(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                ) : (
                    <ProjectTicketFilters
                        filters={filters}
                        onChange={onFilterChange}
                        onReset={onResetFilters}
                        projectKey={projectKey}
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
                        ) : ticketsData?.pages?.length ? (
                            ticketsData.pages
                                .flatMap((page) => page.tickets)
                                .map((ticket) => (
                                    <TableRow
                                        key={ticket.id}
                                        onClick={() =>
                                            void navigate(
                                                `ticket/${ticket.jira_ticket_key}`,
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
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
                                                {ticket.deadline
                                                    ? dayjs(
                                                          ticket.deadline,
                                                      ).format('MMM DD, YYYY')
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

            {hasNextPage && (
                <Box display="flex" my={2}>
                    <Button
                        variant="outlined"
                        onClick={() => fetchNextPage()}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Load More'}
                    </Button>
                </Box>
            )}
        </>
    );
};
