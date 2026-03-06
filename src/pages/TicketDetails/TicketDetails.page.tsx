import { EnumChip } from "@components";
import { EnumSelect } from "@components/EnumSelect/EnumSelect.component";
import { Delete, Edit } from "@mui/icons-material";
import { Box, Card, Container, Paper, Typography, useTheme } from "@mui/material";
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from "constant/ticketEnums";
import { useState } from "react";
import { useParams } from "react-router-dom";


export const TicketDetails = () => {

    const theme = useTheme();
    // to get the key parameter from url
    const { key } = useParams();



    // MOCK DATA
    const MOCK_TICKET = {
        id: "1",
        ticketKey: "T101",
        title: "First Ticket",
        description: "this is a demo ticket related to first bug. this is its description.",
        type: 3,
        status: 2,
        priority: 1,
        createdAt: "2024-03-20T10:30:00Z",
        assignee: "user@example.com",
        reporter: "user@example.com",
        history: [],
        comments: [
            { id: 1, user: "Support Bot", commentText: "Ticket created and assigned to Tech Team.", time: "10:31 AM" },
            { id: 2, user: "Jane Doe", commentText: "Checking the payment logs now.", time: "11:15 AM" }
        ]
    };


    const [ticket, setTicket] = useState(MOCK_TICKET);
    const [isEditing, setIsEditing] = useState(true);







    return (

        <Box>

            <Typography
                variant="h2"
                color={theme.palette.primary.main}
            >
                Ticket: {key}
            </Typography>

            <Card sx={{ padding: '12px' }}>

                {/* heading */}
                <Box display={'flex'} justifyContent={'space-between'}>


                {/* left container */}
                <Box display={'flex'} flexDirection={'row'} gap={8} alignItems={'center'}>
                    <Typography variant="h3">{ticket.title}</Typography>

                    {isEditing ? (
                        <Box display={'flex'} gap={2}>
                            <EnumSelect
                                value={ticket.status}
                                map={TICKET_STATUS}
                                onChange={(status) => setTicket((prev) => ({ ...prev, status }))}
                            />
                            <EnumSelect
                                value={ticket.type}
                                map={TICKET_TYPE}
                                onChange={(status) => setTicket((prev) => ({ ...prev, status }))}
                            />
                            <EnumSelect
                                value={ticket.priority}
                                map={TICKET_PRIORITY}
                                onChange={(status) => setTicket((prev) => ({ ...prev, status }))}
                            />
                        </Box>
                    ) : (
                        <Box display={'flex'} gap={2}>
                            <EnumChip value={ticket.status} map={TICKET_STATUS} />
                            <EnumChip value={ticket.type} map={TICKET_TYPE} />
                            <EnumChip value={ticket.priority} map={TICKET_PRIORITY} />
                        </Box>
                    )
                    }

                </Box>


                {/* right container */}
                <Box display={'flex'} gap={2}>
                    <Edit />
                    <Delete/>
                </Box>


                </Box>






                <Typography variant="body1">{ticket.description}</Typography>
                <Typography variant="body1">Assignee: {ticket.assignee}</Typography>
                <Typography variant="body1">Reporter: {ticket.reporter}</Typography>



            </Card>

        </Box>

    )
}