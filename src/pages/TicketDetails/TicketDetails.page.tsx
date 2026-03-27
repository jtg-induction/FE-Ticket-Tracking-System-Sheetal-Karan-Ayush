import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { Delete as DeleteIcon, Edit as EditIcon, Mail as SubscribeIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { COLORS } from '@constant';
import { CommentCard } from '@containers/CommentCard/CommentCard.container';
import { DeleteTicketDialog } from '@containers/DeleteTicketDialogBox/DeleteTicketDialogBox.container';
import { EditTicketDialog } from '@containers/EditTicketDialogBox/EditTicketDIalogBox.container';
import { MoveTicketDialog } from '@containers/MoveTicketDialogBox/MoveTicketDialogBox.container';
import { SubscribeTicketDialog } from '@containers/SubscribeTicketDialogBox/SubscribeTicketDialogBox.container';
import { useGetTicket } from '@features/ticket/getTicket/useGetTicket';
import { useTicketStore } from '@features/ticket/store/ticketStore';

import { StyledLabel } from './TicketDetails.style';
import {
    ADMIN,
    formatDate,
    TicketConstToPriorityMap,
    TicketConstToStatusMap,
    TicketConstToTypeMap,
} from './TicketDetails.util';


export const TicketDetails: React.FC = () => {
    
    const theme = useTheme();
    const { projectKey, ticketKey } = useParams<{
        projectKey?: string;
        ticketKey?: string;
    }>();
    const { data: ticket } = useGetTicket(
        projectKey as string,
        ticketKey as string,
        
    );
    
    const { setUpdateFormData } = useTicketStore();
    
    

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
    const [isSubsribeDialogOpen, setIsSubsribeDialogOpen] = useState(false)
    
    useEffect (() => {
        if(ticket) {
            setUpdateFormData(ticket)
        }
    },[setUpdateFormData, ticket])

    
    if (!ticket) return <Box>Ticket Not Found</Box>;

    return (
        <>
            
            <Card
                sx={{
                    maxWidth: theme.spacing(200),
                    marginX: 'auto',
                    marginY: theme.spacing(5),
                    borderRadius: 3,
                    boxShadow: 5,
                }}
            >
                <CardContent
                    sx={{
                        paddingX: theme.spacing(5),
                        paddingY: theme.spacing(4),
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                fontSize: {
                                    md: theme.typography.h2.fontSize,
                                },
                            }}
                        >
                            {ticket.title}
                        </Typography>

                        {/* Icon Box with Edit and Delete icons */}
                        <Box>
                            {ticket.role == ADMIN && !ticket.is_archived && 
                            <>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => setIsMoveDialogOpen(true)}
                            >
                                Move
                            </Button>

                            <IconButton
                                sx={{
                                    backgroundColor: COLORS.GRAY.BACKGROUND,
                                    '&:hover': {
                                        backgroundColor:
                                            COLORS.GRAY.SECONDARY,
                                    },
                                    padding: theme.spacing(1),
                                }}
                                onClick={() =>{
                                    setIsEditDialogOpen(true)
                                }}
                            >
                                <EditIcon />
                            </IconButton>

                            <IconButton
                                sx={{
                                    backgroundColor: COLORS.GRAY.BACKGROUND,
                                    '&:hover': {
                                        backgroundColor:
                                            COLORS.GRAY.SECONDARY,
                                    },
                                    padding: theme.spacing(1),
                                }}
                                onClick={() => setIsDeleteDialogOpen(true)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            </>}
                            <IconButton
                                sx={{
                                    backgroundColor: COLORS.GRAY.BACKGROUND,
                                    '&:hover': {
                                        backgroundColor:
                                            COLORS.GRAY.SECONDARY,
                                    },
                                    padding: theme.spacing(1),
                                }}
                                onClick={() => setIsSubsribeDialogOpen(true)} // Open Subsribe dialog
                            >
                                <SubscribeIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Divider sx={{ margin: theme.spacing(4, 0) }} />

                    {/* Description */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: theme.spacing(3),
                        }}
                    >
                        <StyledLabel sx={{ marginTop: 0 }}>
                            <strong>Description:</strong>
                        </StyledLabel>
                        <Typography
                            variant="body2"
                            sx={{
                                marginLeft: theme.spacing(1),
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                                flexGrow: 1,
                                fontSize: {
                                    xs: theme.typography.body2.fontSize,
                                    sm: theme.typography.body2.fontSize,
                                },
                                color: COLORS.GRAY.SECONDARY,
                            }}
                        >
                            {ticket.description ||
                                'No description provided.'}
                        </Typography>
                    </Box>

                    {/* Chips for Type, Priority, and Status */}
                    <Stack
                        direction="row"
                        spacing={2}
                        mb={theme.spacing(3)}
                    >
                        <Chip
                            label={`${TicketConstToTypeMap[ticket.ticket_type]}`}
                            color="primary"
                            size="small"
                            variant="filled"
                        />
                        <Chip
                            label={`${TicketConstToPriorityMap[ticket.priority]}`}
                            color="warning"
                            size="small"
                            variant="filled"
                        />
                        <Chip
                            label={`${TicketConstToStatusMap[ticket.status]}`}
                            color="info"
                            size="small"
                            variant="filled"
                        />
                    </Stack>

                    {/* Assignee, Reporter, Deadline, Created On */}
                    <StyledLabel>
                        <strong>Assignee:</strong>{' '}
                        <span style={{ color: COLORS.GRAY.SECONDARY }}>
                            {ticket.assignee}
                        </span>
                    </StyledLabel>

                    <StyledLabel>
                        <strong>Reporter:</strong>{' '}
                        <span style={{ color: COLORS.GRAY.SECONDARY }}>
                            {ticket.reporter}
                        </span>
                    </StyledLabel>

                    <StyledLabel>
                        <strong>Deadline:</strong>{' '}
                        <span style={{ color: COLORS.GRAY.SECONDARY }}>
                            {ticket.deadline
                                ? formatDate(ticket.deadline)
                                : 'N/A'}
                        </span>
                    </StyledLabel>

                    <StyledLabel>
                        <strong>Created On:</strong>{' '}
                        <span style={{ color: COLORS.GRAY.SECONDARY }}>
                            {formatDate(ticket.created_at)}
                        </span>
                    </StyledLabel>

                    

                    {/* Labels */}
                    <Stack
                        direction="row"
                        spacing={1}
                        mt={theme.spacing(5)}
                        mb={theme.spacing(5)}
                    >
                        {ticket.labels.map((label, index) => (
                            <Chip
                                key={index}
                                label={label}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ textTransform: 'capitalize' }}
                            />
                        ))}
                    </Stack>

                    {/* Add Comment Button */}
                    <CommentCard projectKey={projectKey as string} ticketKey={ticketKey as string} />
                </CardContent>            
            </Card>
            
            <DeleteTicketDialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} />
            <EditTicketDialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} />
            <MoveTicketDialog open={isMoveDialogOpen} onClose={() => setIsMoveDialogOpen(false)} />
            <SubscribeTicketDialog open={isSubsribeDialogOpen} onClose={() => setIsSubsribeDialogOpen(false)} isSubscribed={ticket?.is_subscribed}/>
        </>
    );
};
