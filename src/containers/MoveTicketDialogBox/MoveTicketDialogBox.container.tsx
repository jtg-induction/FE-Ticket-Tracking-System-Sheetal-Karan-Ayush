import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { Typography } from '@mui/material';

import { DialogBox } from '@components/DialogBox';
import { useMoveTicketMutation } from '@features/ticket/moveTicket/useMoveTicketMutation';
import { StyledErrorTextField } from '@pages/Register/Register.styles';
import { theme } from '@theme';

import {
    MAX_PROJECT_KEY_LENGTH,
    MIN_PROJECT_KEY_LENGTH,
} from './moveTicket.constants';
import { MoveTicketProps } from './moveTicket.types';

export const MoveTicketContainer = ({ open, onClose }: MoveTicketProps) => {
    const moveTicketMutation = useMoveTicketMutation();
    const [targetProjectKey, setTargetProjectKey] = useState('');

    const { projectKey, ticketKey } = useParams<{
        projectKey?: string;
        ticketKey?: string;
    }>();

    const trimmedKey = targetProjectKey.trim();
    const isInvalidTargetKey =
        trimmedKey.length < MIN_PROJECT_KEY_LENGTH ||
        trimmedKey.length > MAX_PROJECT_KEY_LENGTH;

    const handleMoveTicket = () => {
        // Guard: ensure required route params exist
        if (!projectKey || !ticketKey) {
            // If params are missing, do not proceed with API call
            return;
        }

        // Trigger mutation to move the ticket
        moveTicketMutation.mutate({
            project_key: projectKey, // Source project key (current project)
            ticket_key: ticketKey, // Ticket identifier
            target_project_key: targetProjectKey, // Destination project key
        });
    };

    return (
        <DialogBox
            open={open}
            title="MoveTicket"
            onClose={onClose}
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
                onChange={(e) => {
                    setTargetProjectKey(e.target.value);
                }}
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
            {moveTicketMutation.isSuccess && (
                <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.success.contrastText }}
                >
                    Ticket moved successfully
                </Typography>
            )}
        </DialogBox>
    );
};
