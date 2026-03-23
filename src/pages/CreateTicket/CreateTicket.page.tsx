import { useState } from 'react';
import React from 'react';

import dayjs from 'dayjs';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { SelectInput } from '@components';
import { ticketCreateSchema } from '@features/ticket/createTicket/createTicket.schema';
import { useCreateTicketMutation } from '@features/ticket/createTicket/useCreateTicketMutation';
import { useTicketStore } from '@features/ticket/store/ticketStore';

import {
    ticketPriorityOptions,
    ticketStatusOptions,
    ticketTypeOptions,
} from './CreateTicket.config';
import { StyledErrorTextField, StyledWrapper } from './CreateTicket.styles';

export const CreateTicket = () => {
    const theme = useTheme();

    const [ticketType, setTicketType] = useState(1);
    const [ticketStatus, setTicketStatus] = useState(1);
    const [ticketPriority, setTicketPriority] = useState(1);
    const [deadline, setDeadline] = React.useState<dayjs.Dayjs | null>(null);
    const { createFormData, setCreateFormData } = useTicketStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const createTicketMutation = useCreateTicketMutation();
    const isSubmitting = createTicketMutation.isPending;
    const { projectKey } = useParams<{ projectKey: string }>();
    const [labels, setLabels] = useState([])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.target as {
            name: keyof typeof createFormData;
            value: string;
        };

        setCreateFormData({ [name]: value });
        setErrors({});
    };

    const handleCreateSubmit = () => {
        const payload = {
            ...createFormData,
            project_key: projectKey,
            labels: ['hii', 'hello'],
            deadline: deadline?.toISOString() ?? null,
        };

        const result = ticketCreateSchema.safeParse(payload);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        createTicketMutation.mutate(result.data, {
            onSuccess: () => {
                setErrors({});
            },
        });
    };

    return (
        <StyledWrapper elevation={2}>
            <Stack spacing={4} padding={'16px'}>
                <Typography
                    variant="h2"
                    align="center"
                    color={theme.palette.primary.main}
                >
                    CREATE NEW TICKET
                </Typography>

                <FormControl sx={{ display: 'flex', gap: '10px' }}>
                    <StyledErrorTextField
                        required
                        name="title"
                        label="Title"
                        error={!!errors.title}
                        helperText={errors.title}
                        onChange={handleChange}
                    />

                    <StyledErrorTextField
                        multiline
                        rows={3}
                        name="description"
                        label="Description"
                        error={!!errors.description}
                        onChange={handleChange}
                        helperText={errors.description}
                    />

                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        gap={'12px'}
                    >
                        {/* ticket type */}
                        <SelectInput
                            name="ticket_type"
                            label="Ticket Type"
                            value={ticketType}
                            options={ticketTypeOptions}
                            onChange={setTicketType}
                            error={!!errors.ticket_type}
                            helperText={errors.ticket_type}
                        />

                        {/* status */}
                        <SelectInput
                            label="Ticket Status"
                            name="status"
                            value={ticketStatus}
                            options={ticketStatusOptions}
                            error={!!errors.status}
                            onChange={setTicketStatus}
                        />

                        {/* priority*/}
                        <SelectInput
                            label="Ticket Priority"
                            name="priority"
                            value={ticketPriority}
                            options={ticketPriorityOptions}
                            error={!!errors.priority}
                            onChange={setTicketPriority}
                        />
                    </Box>

                    {/* assignee */}
                    <StyledErrorTextField
                        required
                        name="assignee"
                        label="Assignee"
                        onChange={handleChange}
                        error={!!errors.assignee}
                        helperText={errors.assignee}
                    />

                    <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={labels}
                        onChange={(_, newValue) => setLabels(newValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                                const { key, ...tagProps } = getTagProps({
                                    index,
                                });
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
                            <TextField
                                {...params}
                                label="Add Labels"
                                placeholder="Type and press Enter"
                            />
                        )}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Deadline"
                            name="deadline"
                            value={deadline}
                            onChange={(value) => setDeadline(value)}
                        />
                    </LocalizationProvider>

                    {createTicketMutation.isError && (
                        <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.error.contrastText }}
                        >
                            {createTicketMutation.error.message}
                        </Typography>
                    )}

                    {createTicketMutation.isSuccess && (
                        <Typography
                            variant="subtitle2"
                            sx={{ color: theme.palette.success.contrastText }}
                        >
                            Ticket Created Successfully
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={handleCreateSubmit}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            'Create'
                        )}
                    </Button>
                </FormControl>
                <Typography align="center">
                    Click{' '}
                    <NavLink to="/ticket/import" color="inherit">
                        here
                    </NavLink>{' '}
                    to import ticket from Jira.
                </Typography>
            </Stack>
        </StyledWrapper>
    );
};
