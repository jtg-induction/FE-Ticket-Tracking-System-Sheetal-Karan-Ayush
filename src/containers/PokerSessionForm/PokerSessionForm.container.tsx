import React, { useState } from "react";

import { TICKET_PRIORITY, TICKET_STATUS, TICKET_TYPE } from "constant/ticketEnums";
import { useDebounce } from "hooks/useDebounce";
import { useLocation, useNavigate } from "react-router-dom";

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Alert, Box, Button, Checkbox, Chip, ChipProps, CircularProgress,
    Divider,
    FormControl,
    FormHelperText,
    IconButton, InputLabel, List, ListItem,
    ListItemButton,
    ListItemText, MenuItem, Paper, Select, Snackbar, Stack,
    TextField, Typography
} from "@mui/material";

import { createSession } from "@api/pokerPlanning/createSessionApi";
import { ProjectTicketFilters } from "@components";
import { StyledErrorTextField } from "@containers/RegisterForm/RegisterForm.styles";
import { SessionCreateSchema, SessionCreateType } from "@features/pokerPlanning/createSession/session.schemas";
import { useSessionStore } from "@features/pokerPlanning/createSession/useSessionCreateStore";
import { QueryParams } from "@features/ticket/getAllTickets/getAllTickets.schema";
import { useGetAllTickets } from "@features/ticket/getAllTickets/usegetAllTickets";
import { useMutation } from "@tanstack/react-query";

import { LocationState, Ticket } from "./PokerSessionForm.types";


type FormErrors = Partial<Record<keyof SessionCreateType | "server", string>>;


export const CreateSessionForm = () => {
    const navigate = useNavigate();
    const setSession = useSessionStore((s) => s.setSession);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [customValueBuffer, setCustomValueBuffer] = useState("");

    const location = useLocation();
    const state = location.state as LocationState | null;
    const passedProjectId = state?.projectId ?? 0;
    const passedProjectKey = state?.projectKey ?? "N/A";


    const defaultFilters: QueryParams = {
        title: "",
        assignee: "",
        status: undefined,
        sort: "latest",
        limit: 10,
        deadline: undefined,
    };
    const [filters, setFilters] = useState<QueryParams>(defaultFilters);
    const debouncedFilters = useDebounce(filters, 500);

    const {
        data,
        isLoading,
    } = useGetAllTickets(passedProjectKey, debouncedFilters, { enabled: !!passedProjectKey });

    const tickets: Ticket[] = data?.pages.flatMap((page) =>
        (page.tickets as Ticket[]).filter(ticket => ticket.status !== 3)
    ) ?? [];

    const [formData, setFormData] = useState<SessionCreateType>({
        title: "",
        description: "",
        project_id: passedProjectId,
        duration: 30,
        tickets_list: [],
        scale_type: 1,
        custom_scale_values: [] as number[],
    });

    const mutation = useMutation({
        mutationFn: async (payload: SessionCreateType) => {
            const transformedData = {
                ...payload,
                duration: payload.duration * 60
            };
            return createSession(transformedData);
        },
        onSuccess: (responseData) => {
            setSession(responseData);
            void navigate(`/sessions/${responseData.id}`);
            setSnackbarOpen(true);
        },
    });

    const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    const toggleTicket = (ticket: Ticket) => {
        const isSelected = formData.tickets_list.some((t) => t.id === ticket.id);
        let newList;
        if (isSelected) {
            newList = formData.tickets_list.filter((t) => t.id !== ticket.id);
        } else {
            newList = [...formData.tickets_list, { id: ticket.id, jira_ticket_key: ticket.jira_ticket_key }];
        }
        setFormData({ ...formData, tickets_list: newList });
    };

    const moveTicket = (index: number, direction: 'up' | 'down') => {
        const newList = [...formData.tickets_list];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newList.length) return;
        [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
        setFormData({ ...formData, tickets_list: newList });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const result = SessionCreateSchema.safeParse(formData);

        if (!result.success) {
            const newErrors: FormErrors = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof SessionCreateType;
                newErrors[fieldName] = issue.message;
            });
            setFormErrors(newErrors);
            return;
        }

        setFormErrors({});
        mutation.mutate(result.data);
    };

    return (
        <>
            <Paper sx={{ p: 4, maxWidth: 724, mx: "auto", mt: 5 }}>
                <Typography variant="h4" align="center" color="primary" mb={4} fontWeight="bold">
                    CREATE NEW POKER PLANNING SESSION
                </Typography>

                {formErrors.server && <Alert severity="error" sx={{ mb: 2 }}>{formErrors.server}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Project"
                            value={passedProjectKey}
                            disabled
                            fullWidth
                            variant="outlined"
                        />

                        <StyledErrorTextField
                            label="Session Title"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            error={!!formErrors.title}
                            helperText={formErrors.title}
                            fullWidth
                        />

                        <StyledErrorTextField
                            label="Description"
                            required
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            fullWidth
                        />

                        <StyledErrorTextField
                            label="Duration (minutes)"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                            error={!!formErrors.duration}
                            helperText={formErrors.duration}
                            fullWidth
                            slotProps={{ htmlInput: { min: 1 } }}
                        />



                        <FormControl fullWidth error={!!formErrors.scale_type}>
                            <InputLabel>Estimation Scale</InputLabel>
                            <Select
                                label="Select estimation Scale"
                                value={formData.scale_type}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    scale_type: Number(e.target.value),
                                    custom_scale_values: e.target.value === 5 ? formData.custom_scale_values : []
                                })}
                            >
                                <MenuItem value={1}>Fibonacci (0, 1, 2, 3, 5, 8)</MenuItem>
                                <MenuItem value={2}>Linear (0-10)</MenuItem>
                                <MenuItem value={3}>Even (0, 2, 4, 6, 8, 10)</MenuItem>
                                <MenuItem value={4}>Odd (0, 1, 3, 5, 7, 9)</MenuItem>
                                <MenuItem value={5}>Custom Scale</MenuItem>
                            </Select>
                            {formErrors.scale_type && <FormHelperText>{formErrors.scale_type}</FormHelperText>}
                        </FormControl>

                        {formData.scale_type === 5 && (
                            <StyledErrorTextField
                                label="Custom scale values"
                                placeholder="e.g. 1, 5, 10"
                                required
                                value={customValueBuffer}
                                onChange={(e) => {
                                    const rawValue = e.target.value;
                                    setCustomValueBuffer(rawValue);

                                    const values = rawValue
                                        .split(',')
                                        .map(v => parseInt(v.trim()))
                                        .filter(v => !isNaN(v));

                                    setFormData({ ...formData, custom_scale_values: values });
                                }}
                                error={!!formErrors.custom_scale_values}
                                helperText={formErrors.custom_scale_values || "Enter the numbers you want to use for estimation"}
                                fullWidth
                            />
                        )}


                        <Divider />

                        <Typography variant="h4">Select Tickets</Typography>

                        <ProjectTicketFilters
                            filters={filters}
                            onChange={(field, val) => setFilters(prev => ({ ...prev, [field]: val }))}
                            onReset={() => setFilters(defaultFilters)}
                        />

                        <Typography variant="subtitle2" color="text.secondary">AVAILABLE TICKETS</Typography>
                        <Paper variant="outlined" sx={{ maxHeight: 250, overflow: 'auto' }}>
                            {isLoading ? (
                                <CircularProgress />
                            ) : (
                                <List dense>

                                    {tickets.map((ticket: Ticket) => {

                                        const status = TICKET_STATUS[ticket.status as 1 | 2 | 3];
                                        const priority = TICKET_PRIORITY[ticket.priority as 1 | 2 | 3];
                                        const type = TICKET_TYPE[ticket.ticket_type as 1 | 2 | 3 | 4 | 5];

                                        const isSelected = formData.tickets_list.some(t => t.id === ticket.id);

                                        return (
                                            <ListItem key={ticket.id} divider disablePadding>
                                                <ListItemButton onClick={() => toggleTicket(ticket)}>
                                                    <Checkbox checked={isSelected} disableRipple />

                                                    <Stack direction="row" spacing={2} alignItems="center" width="100%">
                                                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                                                            {ticket.jira_ticket_key}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                                            {ticket.title}
                                                        </Typography>

                                                        {ticket.points &&
                                                            (<Chip
                                                                label={`${ticket.points} pts`}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />)}

                                                        <Chip
                                                            label={type?.label || "Task"}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            label={priority?.label || "Low"}
                                                            size="small"
                                                            color={(priority?.color as ChipProps["color"]) || "default"}
                                                        />
                                                        <Chip
                                                            label={status?.label || "Open"}
                                                            size="small"
                                                            color={(status?.color as ChipProps["color"]) || "default"}
                                                        />
                                                    </Stack>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}

                                </List>
                            )}
                        </Paper>

                        {formData.tickets_list.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    ESTIMATION ORDER (TOP TO BOTTOM)
                                </Typography>
                                <Paper variant="outlined">

                                    <List dense>
                                        {formData.tickets_list.map((ticket, index) => (


                                            <ListItem
                                                key={ticket.id}
                                                divider={index !== formData.tickets_list.length - 1}
                                                secondaryAction={
                                                    <Box>
                                                        <IconButton
                                                            size="small"
                                                            disabled={index === 0}
                                                            onClick={() => moveTicket(index, 'up')}
                                                        >
                                                            <ArrowUpwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            disabled={index === formData.tickets_list.length - 1}
                                                            onClick={() => moveTicket(index, 'down')}
                                                        >
                                                            <ArrowDownwardIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => toggleTicket(ticket as Ticket)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                }
                                            >
                                                <ListItemText primary={`${index + 1}. ${ticket.jira_ticket_key}`} />
                                            </ListItem>
                                        ))}
                                    </List>

                                </Paper>
                            </Box>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Creating..." : "Create Session"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Session created successfully!
                </Alert>
            </Snackbar>
        </>
    );
};
