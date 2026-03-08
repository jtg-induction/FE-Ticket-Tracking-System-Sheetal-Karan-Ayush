import { useState } from 'react';
import React from 'react';

import dayjs from 'dayjs';
import { useEmailValidation } from 'hooks/useEmailValidation';

import {
    Autocomplete,
    Box,
    Button,
    Chip,
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
import { JiraImportDialog } from '@containers';

import {
    ticketPriorityOptions,
    ticketStatusOptions,
    ticketTypeOptions,
} from './CreateTicket.config';
import { StyledErrorTextField, StyledWrapper } from './CreateTicket.styles';

export const CreateTicket = () => {
    const theme = useTheme();

    const [ticketType, setTicketType] = useState(0);
    const [ticketStatus, setTicketStatus] = useState(0);
    const [ticketPriority, setTicketPriority] = useState(0);
    const [labels, setLabels] = useState<string[]>([]);
    const [deadline, setDeadline] = React.useState<dayjs.Dayjs | null>(null);
    const [openJiraDialog, setOpenJiraDialog] = useState(false);

    const {
        email: reporter,
        isInvalid: isInvalidReporter,
        handleChange: handleReporterChange,
    } = useEmailValidation();

    const {
        email: assignee,
        isInvalid: isInvalidAssignee,
        handleChange: handleAssigneeChange,
    } = useEmailValidation();

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
                    <TextField required name="title" label="Title" />

                    <TextField
                        multiline
                        rows={3}
                        name="description"
                        label="Description"
                    />

                    {/* jira ticket key */}
                    <TextField name="key" label="Ticket key" />

                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        justifyContent={'space-between'}
                        gap={'12px'}
                    >
                        {/* ticket type */}
                        <SelectInput
                            label="Ticket Type"
                            value={ticketType}
                            options={ticketTypeOptions}
                            onChange={setTicketType}
                        />

                        {/* status */}
                        <SelectInput
                            label="Ticket Status"
                            value={ticketStatus}
                            options={ticketStatusOptions}
                            onChange={setTicketStatus}
                        />

                        {/* priority*/}
                        <SelectInput
                            label="Ticket Priority"
                            value={ticketPriority}
                            options={ticketPriorityOptions}
                            onChange={setTicketPriority}
                        />
                    </Box>

                    {/* assignee */}
                    <StyledErrorTextField
                        required
                        name="assignee"
                        label="Assignee"
                        type="email"
                        value={assignee}
                        onChange={handleAssigneeChange}
                        error={isInvalidAssignee}
                        helperText={
                            isInvalidAssignee
                                ? 'Enter a valid email address'
                                : ''
                        }
                    />

                    {/* reporter */}
                    <StyledErrorTextField
                        required
                        name="reporter"
                        label="Reporter"
                        type="email"
                        value={reporter}
                        onChange={handleReporterChange}
                        error={isInvalidReporter}
                        helperText={
                            isInvalidReporter
                                ? 'Enter a valid email address'
                                : ''
                        }
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
                            value={deadline}
                            onChange={(value) => setDeadline(value)}
                        />
                    </LocalizationProvider>

                    <Button variant="contained" color="primary" type="submit">
                        Create
                    </Button>
                </FormControl>

                <Typography
                    align="center"
                    sx={{ cursor: 'pointer' }}
                    color="info.contrastText"
                    onClick={() => setOpenJiraDialog(true)}
                >
                    Click here to import ticket from Jira.
                </Typography>
                <JiraImportDialog
                    open={openJiraDialog}
                    handleClose={() => setOpenJiraDialog(false)}
                />
            </Stack>
        </StyledWrapper>
    );
};
