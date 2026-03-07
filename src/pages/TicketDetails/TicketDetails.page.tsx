import { EnumChip } from "@components";
import { EnumSelect } from "@components/EnumSelect/EnumSelect.component";
import { Delete, Edit } from "@mui/icons-material";
import { Autocomplete, Box, Button, Card, Chip, Container, Paper, TextField, Typography, useTheme } from "@mui/material";
import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from "constant/ticketEnums";
import { useState } from "react";
import { useParams } from "react-router-dom";


export const TicketDetails = () => {

    const theme = useTheme();
    




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
        assignee: "john@gmail.com",
        reporter: "smith@example.com",
        labels: ["issue", "minor", "first", "mandatory"],
        history: [],
        comments: [
            { id: 1, user: "Support Bot", commentText: "Ticket created and assigned to Tech Team.", time: "10:31 AM" },
            { id: 2, user: "Jane Doe", commentText: "Checking the payment logs now.", time: "11:15 AM" }
        ]
    };

    const { projectKey, ticketKey } = useParams();

    const [ticket, setTicket] = useState(MOCK_TICKET);
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(`${ticket.description}`);
    const [title, setTitle] = useState(`${ticket.title}`);
    const [assignee, setAssignee] = useState(`${ticket.assignee}`);
    const [reporter, setReporter] = useState(`${ticket.reporter}`);
    const [labels, setLabels] = useState<string[]>(ticket.labels);

    //TODO: modify to call update api on save (if isEditing)
    const handleEditClick = () => {
        setIsEditing(!isEditing);
    }





    return (

        <Box>

            {/* for heading -> project and ticket headings */}
            <Box padding={'12px'}>
                <Typography variant="h3" color="info.contrastText">Project: {projectKey}</Typography>

                <Box display={'flex'} gap={4}>
                    <Typography variant="h2">
                        Ticket: {ticketKey}
                    </Typography>

                    <EnumSelect
                        value={ticket.status}
                        map={TICKET_STATUS}
                        onChange={(status) => setTicket((prev) => ({ ...prev, status }))}
                    />

                </Box>
            </Box>


            {/* for centre card having three partitions */}
            <Box display={'flex'} gap={3}>

                {/* ticket info card */}
                <Box sx={{flex: 4, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* first card in info card -> having title, description and labels (first of three partitions) */}
                    <Card sx={{ padding: '12px' }}>
                        {/* heading -> title and icons */}
                        <Box display={'flex'} justifyContent={'space-between'}>

                            {/* left container */}
                            <TextField
                                label={isEditing ? "Title" : null}
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                slotProps={{
                                    input: {
                                        readOnly: !isEditing,
                                        disableUnderline: !isEditing,
                                    },
                                }}
                                variant={isEditing ? "outlined" : "standard"}
                                sx={{
                                    "& .MuiInputBase-input": !isEditing ? (theme) => ({
                                        ...theme.typography.h3,
                                        color: theme.palette.primary.main,
                                    }) : {},
                                }}
                            />

                            {/* right container */}
                            <Box display={'flex'} gap={2} alignItems={'center'}>
                                {isEditing ? <Button onClick={handleEditClick}>Save</Button> : <Edit onClick={handleEditClick} />}
                                <Delete />
                            </Box>
                        </Box>

                        {/* description */}
                        <TextField
                            label={isEditing ? "Description" : null}
                            multiline
                            fullWidth
                            minRows={isEditing ? 3 : 1}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            slotProps={{
                                input: {
                                    readOnly: !isEditing,
                                    disableUnderline: !isEditing,
                                },
                            }}
                            variant={isEditing ? "outlined" : "standard"}
                        />

                        {/* for showing labels */}
                        {isEditing ?
                            <Autocomplete
                                multiple
                                freeSolo
                                options={[]}
                                value={labels}
                                onChange={(_, newValue) => setLabels(newValue)}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => {
                                        const { key, ...tagProps } = getTagProps({ index });
                                        return (
                                            <Chip
                                                key={key}
                                                label={option}
                                                {...tagProps}
                                                color="success"
                                            />
                                        );
                                    })
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Add Labels" placeholder="Type and press Enter" />
                                )}
                            />
                            :
                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography variant="body1">Labels:</Typography>

                                {labels.map((label, index) => (
                                    <Chip
                                        key={index}
                                        label={label}
                                        color="success"
                                    />
                                ))}
                            </Box>
                        }

                    </Card>

                    {/* second card in info card -> having assignments (first of three partitions) */}
                    <Card sx={{ padding: '12px' }}>

                        <Typography variant="body1" color="info.contrastText">ASSIGNMENTS</Typography>

                        {/* assignee */}
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                            <Typography variant="body1">Assignee:</Typography>
                            <TextField
                                fullWidth
                                type="email"
                                value={assignee}
                                onChange={(e) => setAssignee(e.target.value)}
                                slotProps={{
                                    input: {
                                        readOnly: !isEditing,
                                        disableUnderline: !isEditing,
                                    },
                                }}
                                variant={isEditing ? "outlined" : "standard"}
                            />
                        </Box>
                        {/* reporter */}
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                            <Typography variant="body1">Reporter:</Typography>
                            <TextField
                                fullWidth
                                type="email"
                                value={reporter}
                                onChange={(e) => setReporter(e.target.value)}
                                slotProps={{
                                    input: {
                                        readOnly: !isEditing,
                                        disableUnderline: !isEditing,
                                    },
                                }}
                                variant={isEditing ? "outlined" : "standard"}
                            />
                        </Box>

                    </Card>
                </Box>

                {/* status, type and priority details card */}
                <Card sx={{ flex: 1, padding: '12px', maxWidth: '250px', minWidth: '180px' }}>

                    {isEditing ? (
                        <Box display={'flex'} flexDirection={'column'} gap={4} >
                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography>Status:</Typography>
                                <EnumSelect
                                    value={ticket.status}
                                    map={TICKET_STATUS}
                                    onChange={(status) => setTicket((prev) => ({ ...prev, status }))}
                                />
                            </Box>

                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography>Type:</Typography>
                                <EnumSelect
                                    value={ticket.type}
                                    map={TICKET_TYPE}
                                    onChange={(type) => setTicket((prev) => ({ ...prev, type }))}
                                />
                            </Box>

                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography>Priority:</Typography>
                                <EnumSelect
                                    value={ticket.priority}
                                    map={TICKET_PRIORITY}
                                    onChange={(priority) => setTicket((prev) => ({ ...prev, priority }))}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box display={'flex'} flexDirection={'column'} gap={4}>
                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography>Status:</Typography>
                                <EnumChip value={ticket.status} map={TICKET_STATUS} />
                            </Box>
                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography>Type:</Typography>
                                <EnumChip value={ticket.type} map={TICKET_TYPE} />
                            </Box>
                            <Box display={'flex'} alignItems={'center'} gap={2}>
                                <Typography>Priority:</Typography>
                                <EnumChip value={ticket.priority} map={TICKET_PRIORITY} />
                            </Box>
                        </Box>
                    )
                    }
                </Card>


                {/* history card */}
                <Card sx={{ padding: '12px', flex: 2 }}>
                    <Typography variant="h3" textAlign={'center'}>History</Typography>
                </Card>

            </Box>

            {/*comments card*/}
            <Card sx={{ padding: '12px'}}>
                <Typography variant="h3">Comments</Typography>
            </Card>

        </Box>

    )
}