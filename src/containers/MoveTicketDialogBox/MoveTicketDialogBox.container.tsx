import { useState } from "react";

import { useParams } from "react-router-dom";

import { Typography } from "@mui/material";

import { DialogBox } from "@components/DialogBox";
import { useMoveTicketMutation } from "@features/ticket/moveTicket/useMoveTicketMutation";
import { StyledErrorTextField } from "@pages/Register/Register.styles";
import { theme } from "@theme";

import { MAX_PROJECT_KEY_LENGTH, MIN_PROJECT_KEY_LENGTH } from "./moveTicket.constants";
import { MoveTicketProps } from "./moveTicket.types";

export const MoveTicketContainer = ({isMoveDialogOpen, setIsMoveDialogOpen}: MoveTicketProps) => {
    const moveTicketMutation = useMoveTicketMutation();
    const [targetProjectKey, setTargetProjectKey] = useState('');

    const { projectKey, ticketKey } = useParams<{
        projectKey: string;
        ticketKey: string;
    }>();

    const trimmedKey = targetProjectKey.trim();
    const isInvalidTargetKey = trimmedKey.length < MIN_PROJECT_KEY_LENGTH ||
                               trimmedKey.length > MAX_PROJECT_KEY_LENGTH;

    const handleMoveTicket = () => {
        moveTicketMutation.mutate(
            {   
                project_key: projectKey as string, 
                ticket_key: ticketKey as string, 
                target_project_key: targetProjectKey
            })
    }

    return (
        <DialogBox
            open={isMoveDialogOpen}
            title="MoveTicket"
            onClose={() => setIsMoveDialogOpen(false)}
            onSubmit={handleMoveTicket}
            submitText="Confirm"
            cancelText="Cancel"
            isSubmitDisabled={isInvalidTargetKey}
        >
            <StyledErrorTextField
                label="Target Jira Project Key"
                variant="outlined"
                fullWidth
                value={targetProjectKey}
                onChange={(e) => { setTargetProjectKey(e.target.value)}}
                sx={{ marginBottom: 2 }}
            />
            {moveTicketMutation.isError && (
                <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.error.contrastText }}
                >
                    {moveTicketMutation.error.message}
                </Typography>
            )}
        </DialogBox>
    )
}
