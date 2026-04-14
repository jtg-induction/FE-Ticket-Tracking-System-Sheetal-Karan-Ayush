import { useState } from "react";

import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from "constant/ticketEnums";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Card, Chip, ChipProps, Collapse, Divider, Stack, Typography } from "@mui/material";

import { TicketListProps } from "./TicketList.types";


export const TicketList = ({
    tickets,
    activeTicketId,
    showControls = false,
    isOrganizer = false,
    onActivate,
    resolvedTickets = [],
    heading = "Tickets",
    defaultExpanded = true,
}: TicketListProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <Card >
            <Box
                padding={2}
                display={'flex'}
                justifyContent={'space-between'}
                sx={{ cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
            >
                <Typography>
                    {heading} ({tickets.length})
                </Typography>
                {expanded ? <ExpandLess /> : <ExpandMore />}
            </Box>

            <Divider />
            <Collapse in={expanded}>

                <Box >
                    {tickets.length > 0 ? (
                        <Stack divider={<Divider />}>
                            {tickets.map((ticket) => {
                                const statusInfo = TICKET_STATUS[ticket.status as keyof typeof TICKET_STATUS] || { label: 'Unknown', color: 'default' };
                                const priorityInfo = TICKET_PRIORITY[ticket.priority as keyof typeof TICKET_PRIORITY] || { label: 'N/A', color: 'default' };
                                const typeInfo = TICKET_TYPE[ticket.ticket_type as keyof typeof TICKET_TYPE] || { label: 'Task', color: 'default' };

                                const isActive = Number(ticket.id) === Number(activeTicketId);

                                const resolvedData = resolvedTickets.find(
                                    (r) => Number(r.ticket_id) === Number(ticket.id)
                                );

                                return (
                                    <Box
                                        key={ticket.id}
                                        padding={2}
                                    >
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                                                {ticket.jira_ticket_key}
                                            </Typography>
                                            <Typography variant="body1" fontWeight={isActive ? "bold" : "normal"}>
                                                {ticket.title}
                                            </Typography>
                                        </Box>

                                        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                                            <Box display="flex" gap={1}>

                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Chip
                                                        label={priorityInfo.label}
                                                        size="small"
                                                        color={priorityInfo.color as ChipProps['color']}
                                                    />
                                                    <Chip
                                                        label={typeInfo.label}
                                                        size="small"
                                                        color={typeInfo.color as ChipProps['color']}
                                                    />
                                                    <Chip
                                                        label={statusInfo.label}
                                                        size="small"
                                                        color={statusInfo.color as ChipProps['color']}
                                                    />
                                                    {resolvedData && (
                                                        <Chip
                                                            label={`${resolvedData.estimate} pt`}
                                                            color="success"
                                                            size="small"
                                                            variant="filled"
                                                        />
                                                    )}
                                                    {!resolvedData && ticket.points !== null && (
                                                        <Chip
                                                            label={`${ticket.points} pts`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Stack>
                                            </Box>

                                            {showControls && isOrganizer && (
                                                <Button
                                                    size="small"
                                                    variant={isActive ? "outlined" : "contained"}
                                                    disabled={isActive || !!resolvedData || !!ticket.points}
                                                    onClick={() => onActivate?.(ticket.id)}
                                                >
                                                    {resolvedData || ticket.points ? "Resolved" : isActive ? "Active" : "Select"}
                                                </Button>
                                            )}
                                        </Stack>
                                    </Box>
                                );
                            })}
                        </Stack>
                    ) : (
                        <Box p={4} textAlign="center">
                            <Typography color="text.secondary">No tickets found.</Typography>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Card>
    );
}
