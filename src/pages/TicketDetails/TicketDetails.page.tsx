import React, { useState } from 'react';

import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';

import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DialogBox } from '@components/DialogBox';
import { COLORS } from '@constant';
import { useDeleteTicket } from '@features/ticket/deleteTicket/useDeleteTicketMutation';
import { useGetTicket } from '@features/ticket/getTicket/useGetTicket';
import { useTicketStore } from '@features/ticket/store/ticketStore';
import {
    TicketUpdateFormData,
    ticketUpdateRequestSchema,
} from '@features/ticket/updateTicket/updateTicket.schema';
import { useUpdateTicketMutation } from '@features/ticket/updateTicket/useUpdateTicketMutation';

import { StyledErrorTextField, StyledLabel } from './TicketDetails.style';
import {
    TicketConstToPriorityMap,
    TicketConstToStatusMap,
    TicketConstToTypeMap,
} from './TicketDetails.util';

export const TicketDetails: React.FC = () => {
    const theme = useTheme();
    const { projectKey, ticketKey } = useParams<{
        projectKey: string;
        ticketKey: string;
    }>();
    const { data: ticket } = useGetTicket(
        projectKey as string,
        ticketKey as string,
    );
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
        useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const deleteTicketMutation = useDeleteTicket();
    const { updateFormData, setUpdateFormData } = useTicketStore();
    const updateTicketMutation = useUpdateTicketMutation();
    const [deadline, setDeadline] = React.useState<dayjs.Dayjs | null>(null);
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString();

    const handleDeleteTicket = () => {
        if (!projectKey || !ticketKey) {
            return;
        }
        deleteTicketMutation.mutate(
            { projectKey, ticketKey },
            {
                onSuccess: () => setIsDeleteDialogOpen(false),
            },
        );
    };


    const handleFieldChange = (
        field: keyof TicketUpdateFormData,
        value: TicketUpdateFormData[keyof TicketUpdateFormData],
    ) => {
        setUpdateFormData({ [field]: value });
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSaveChanges = () => {
        const payload = {
            ...updateFormData,
            project_key: projectKey,
            ticket_key: ticketKey,
            deadline: deadline ? deadline.toISOString(): undefined,
        }
        const result = ticketUpdateRequestSchema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        updateTicketMutation.mutate(result.data);
        // setIsEditDialogOpen(false);
    };

    return (
        <>
            {ticket ? (
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
                                <IconButton
                                    sx={{
                                        backgroundColor: COLORS.GRAY.BACKGROUND,
                                        '&:hover': {
                                            backgroundColor:
                                                COLORS.GRAY.SECONDARY,
                                        },
                                        padding: theme.spacing(1),
                                    }}
                                    onClick={() => setIsEditDialogOpen(true)} // Open edit dialog
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

                        <Divider sx={{ margin: theme.spacing(5, 0) }} />

                        {/* Labels */}
                        <Stack
                            direction="row"
                            spacing={1}
                            mb={theme.spacing(3)}
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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                sx={{
                                    paddingX: theme.spacing(3),
                                    paddingY: theme.spacing(1),
                                    fontWeight: 600,
                                }}
                            >
                                Add Comment
                            </Button>
                        </Box>
                    </CardContent>

                    {/* Delete Confirmation Dialog */}
                    <DialogBox
                        open={isDeleteDialogOpen}
                        title="Confirm Delete"
                        onClose={() => setIsDeleteDialogOpen(false)}
                        onSubmit={handleDeleteTicket}
                        submitText="Delete"
                        cancelText="Cancel"
                    >
                        <Typography>
                            Are you sure you want to delete?
                        </Typography>
                    </DialogBox>
                </Card>
            ) : (
                <div>Ticket Not Found</div>
            )}

            {/* Edit Ticket Dialog */}
            <DialogBox
                open={isEditDialogOpen}
                title="Edit Ticket"
                onClose={() => setIsEditDialogOpen(false)}
                onSubmit={handleSaveChanges}
                submitText="Save"
                cancelText="Cancel"
            >
                {/* Description */}
                <StyledErrorTextField
                    label="Title"
                    fullWidth
                    value={updateFormData?.title || ''}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    sx={{ marginBottom: theme.spacing(2) }}
                    error={!!errors.title}
                    helperText={errors.title}
                />

                <StyledErrorTextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={updateFormData?.description || ''}
                    onChange={(e) =>
                        handleFieldChange('description', e.target.value)
                    }
                    sx={{ marginBottom: theme.spacing(2) }}
                    error={!!errors.description}
                    helperText={errors.description}
                />

                {/* Priority */}
                <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={updateFormData?.priority || 1}
                        onChange={(e) =>
                            handleFieldChange(
                                'priority',
                                Number(e.target.value),
                            )
                        }
                        label="Priority"
                    >
                        {Object.entries(TicketConstToPriorityMap).map(
                            ([key, value]) => (
                                <MenuItem key={key} value={Number(key)}>
                                    {value}
                                </MenuItem>
                            ),
                        )}
                    </Select>
                </FormControl>

                {/* Status */}
                <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={updateFormData?.status || 1}
                        onChange={(e) =>
                            handleFieldChange('status', Number(e.target.value))
                        }
                        label="Status"
                    >
                        {Object.entries(TicketConstToStatusMap).map(
                            ([key, value]) => (
                                <MenuItem key={key} value={Number(key)}>
                                    {value}
                                </MenuItem>
                            ),
                        )}
                    </Select>
                </FormControl>

                {/* Task Type */}
                <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
                    <InputLabel>Task Type</InputLabel>
                    <Select
                        value={updateFormData?.ticket_type || 1}
                        onChange={(e) =>
                            handleFieldChange(
                                'ticket_type',
                                Number(e.target.value),
                            )
                        }
                        label="Task Type"
                    >
                        {Object.entries(TicketConstToTypeMap).map(
                            ([key, value]) => (
                                <MenuItem key={key} value={Number(key)}>
                                    {value}
                                </MenuItem>
                            ),
                        )}
                    </Select>
                </FormControl>

                {/* Deadline */}
                <StyledLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Deadline"
                            name="deadline"
                            value={deadline}
                            onChange={(value) => setDeadline(value)}
                        />
                    </LocalizationProvider>
                </StyledLabel>

                {updateTicketMutation.isError && (
                    <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.error.contrastText }}
                    >
                        {updateTicketMutation.error.message}
                    </Typography>
                )}

                {updateTicketMutation.isSuccess && (
                    <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.success.contrastText }}
                    >
                        Ticket Updated Successfully
                    </Typography>
                )}
            </DialogBox>
        </>
    );
};
