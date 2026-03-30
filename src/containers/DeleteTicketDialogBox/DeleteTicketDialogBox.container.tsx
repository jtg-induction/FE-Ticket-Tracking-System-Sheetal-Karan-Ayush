import { useParams } from "react-router-dom";

import { Typography } from "@mui/material";

import { DialogBox } from "@components/DialogBox";
import { useDeleteTicket } from "@features/ticket/deleteTicket/useDeleteTicketMutation";

import { DeleteTicketProps } from "./deleteTicket.types";

export const DeleteTicketDialog = ({open, onClose}: DeleteTicketProps) => {
    const deleteTicketMutation = useDeleteTicket();
    const { projectKey, ticketKey } = useParams<{
        projectKey?: string;
        ticketKey?: string;
    }>();

    const handleDeleteTicket = () => {
        if (!projectKey || !ticketKey) {
            return;
        }
        deleteTicketMutation.mutate(
            { projectKey, ticketKey },
            {
                onSuccess: () => onClose(),
            },
        );
    };

    return (
        <DialogBox
            open={open}
            title="Confirm Delete"
            onClose={onClose}
            onSubmit={handleDeleteTicket}
            submitText="Delete"
            cancelText="Cancel"
            isSubmitDisabled={deleteTicketMutation.isPending}
            isSubmitting={deleteTicketMutation.isPending}
        >
            <Typography>
                Are you sure you want to delete this Ticket?
            </Typography>
        </DialogBox>
    )
}
