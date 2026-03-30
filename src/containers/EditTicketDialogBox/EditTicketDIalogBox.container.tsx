import { useState } from "react";

import dayjs from "dayjs";
import { useParams } from "react-router-dom";

import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DialogBox } from "@components/DialogBox";
import { useTicketStore } from "@features/ticket/store/ticketStore";
import { TicketUpdateFormData, ticketUpdateRequestSchema } from "@features/ticket/updateTicket/updateTicket.schema";
import { useUpdateTicketMutation } from "@features/ticket/updateTicket/useUpdateTicketMutation";
import { StyledErrorTextField } from "@pages/Register/Register.styles";
import { TicketConstToPriorityMap, TicketConstToStatusMap, TicketConstToTypeMap } from "@pages/TicketDetails/TicketDetails.util";
import { theme } from "@theme";

import { EditTicketProps } from "./editTicket.types";


export const EditTicketDialog = ({ open, onClose }: EditTicketProps) => {
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { updateFormData, setUpdateFormData } = useTicketStore();
    const updateTicketMutation = useUpdateTicketMutation();
    
    const { projectKey, ticketKey } = useParams<{
        projectKey?: string;
        ticketKey?: string;
    }>();

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
        updateTicketMutation.mutate(result.data, {onSuccess: () => onClose()});
    };
    

    return (
        <DialogBox
            open={open}
            title="Edit Ticket"
            onClose={onClose}
            onSubmit={handleSaveChanges}
            isSubmitting={updateTicketMutation.isPending}
            isSubmitDisabled={updateTicketMutation.isPending}
        >
            {/* Description */}
            <StyledErrorTextField
                label="Title"
                fullWidth
                value={updateFormData?.title}
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
                value={updateFormData?.description}
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

            {/* Ticket Type */}
            <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
                <InputLabel>Ticket Type</InputLabel>
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Deadline"
                    name="deadline"
                    value={updateFormData?.deadline ? dayjs(updateFormData.deadline): null}
                    onChange={(value) => handleFieldChange('deadline', value?.toISOString())}
                />
            </LocalizationProvider>

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
    )
}
