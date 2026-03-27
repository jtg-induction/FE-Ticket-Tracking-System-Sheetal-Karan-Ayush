import { useState } from 'react';

import { useParams } from 'react-router-dom';

import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';

import { DialogBox } from '@components';
import {
    inviteUserRequestSchema,
    useInviteUserMutation,
} from '@features/inviteUser';
import { theme } from '@theme';

import { InviteUserProps, UserRole } from './InviteUser.types';

export const InviteUser = ({open, onClose, projectId} : InviteUserProps) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const inviteMutation = useInviteUserMutation();
    const { projectKey } = useParams<{ projectKey: string }>();
    const inviteOnClick = () => {
        const formData = {
            email,
            role,
            project_id: projectId as number,
            project_key: projectKey as string,
        };

        const result = inviteUserRequestSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setErrors({});
        inviteMutation.mutate(formData, {
            onSuccess: () => onClose()
        });
    };

    
            
            
    return (
        <>
            <DialogBox
                open={open}
                onClose={onClose}
                title="Invite User"
                submitText="Invite"
                cancelText="Cancel"
                onSubmit={inviteOnClick}
                isSubmitDisabled={inviteMutation.isPending}
                isSubmitting={inviteMutation.isPending}
            >
                <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    spellCheck={false}
                />
                {errors.email && (
                    <Typography
                        variant="subtitle2"
                        sx={{ color: theme.palette.error.contrastText }}
                    >
                        {errors.email}
                    </Typography>
                )}

                <FormControl>
                    <FormLabel>Role</FormLabel>
                    <RadioGroup
                        row
                        value={role}
                        onChange={(e) =>
                            setRole(Number(e.target.value) as UserRole)
                        }
                    >
                        <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label="admin"
                        />
                        <FormControlLabel
                            value={2}
                            control={<Radio />}
                            label="developer"
                        />
                    </RadioGroup>
                </FormControl>
                {inviteMutation.isError && (
                    <Typography variant='subtitle2' sx={{ color: theme.palette.error.contrastText }}>
                        {inviteMutation.error.message}
                    </Typography>
                )}
            </DialogBox>
        </>
    );
};
