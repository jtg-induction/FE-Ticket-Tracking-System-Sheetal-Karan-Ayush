import { useState } from 'react';

import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import Button from '@mui/material/Button';

import { AppDialog } from '@components/AppDialog/AppDialog.component';
import { useInviteUser } from '@features/inviteUser/useInviteUser';

import { UserRole } from './InviteUser.types';

export const InviteUser = () => {
    const [open, setOpen] = useState(true);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('developer');

    const inviteMutation = useInviteUser();

    const inviteOnClick = () => {
        inviteMutation.mutate({ email, role });
    };

    return (
        <>
            <AppDialog
                open={open}
                onClose={() => setOpen(false)}
                title="Invite User"
                actions={
                    <>
                        <Button variant="contained" onClick={inviteOnClick}>
                            Invite
                        </Button>
                    </>
                }
            >
                <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FormControl>
                    <FormLabel>Role</FormLabel>
                    <RadioGroup
                        row
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                    >
                        <FormControlLabel
                            value="admin"
                            control={<Radio />}
                            label="admin"
                        />
                        <FormControlLabel
                            value="developer"
                            control={<Radio />}
                            label="developer"
                        />
                    </RadioGroup>
                </FormControl>
            </AppDialog>
        </>
    );
};
