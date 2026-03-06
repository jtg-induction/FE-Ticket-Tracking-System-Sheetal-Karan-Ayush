import { useState } from "react"

import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";

import { AppDialog } from "@components/AppDialog/AppDialog.component";
import { inviteUserRequestSchema } from "@features/inviteUser";
import { useInviteUserMutation } from "@features/inviteUser/useInviteUserMutation";
import { theme } from "@theme";

import { InviteUserProps, UserRole } from "./InviteUser.types";

export const InviteUser = ({open, setOpen, projectId, projectKey}: InviteUserProps) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>(2);
    const [errors, setErrors] = useState<Record<string, string>>({})
    const inviteMutation = useInviteUserMutation();
    const inviteOnClick = () => {
        const formData = {
            email,
            role,
            project_id: projectId,
            project_key: projectKey,
        }

        const result = inviteUserRequestSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: Record<string, string> = {}

            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as string
                fieldErrors[field] = issue.message
            })
            setErrors(fieldErrors)
            return
        }
        setErrors({})
        inviteMutation.mutate(formData);
    }

    return (
        <>
            <AppDialog open={open} onClose={() => setOpen(false)} title="Invite User" 
            actions={
                <Button variant="contained" onClick={inviteOnClick}>
                    Invite
                </Button>
            }
            >
                <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} spellCheck={false}/>
                {errors.email && 
                <Typography variant='subtitle2' sx={{ color: theme.palette.error.contrastText }}>
                    {errors.email}
                </Typography>}
                
                <FormControl>
                    <FormLabel>Role</FormLabel>
                    <RadioGroup row value={role} onChange={(e) => setRole(Number(e.target.value) as UserRole)}>
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
                {inviteMutation.isSuccess && (
                    <Typography variant='subtitle2' sx={{ color: theme.palette.success.contrastText }}>
                        {inviteMutation.data.message}
                    </Typography>
                )}
            </AppDialog>
        </>    
    )
}
