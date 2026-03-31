import { useParams } from "react-router-dom";

import { Typography } from "@mui/material";

import { DialogBox } from "@components/DialogBox";
import { useUpdateUserRoleMutation } from "@features/updateRole/useUpdateRoleMutation";

import { UpgradeRoleProps } from "./upgradeRole.types";


export const UpgradeRoleDialog = ({open, onClose, userId, setIsRoleButtonVisible }: UpgradeRoleProps) => {

    const updateUserRole = useUpdateUserRoleMutation();
    const { projectKey } = useParams<{
        projectKey: string;
    }>();

    const handleSubmit = () => {

        updateUserRole.mutate(
            {   
                project_key: projectKey as string, 
                user_id: userId as number,
            }, 
            {
                onSuccess: () => (

                    onClose(),
                    setIsRoleButtonVisible((prev)=> !prev)

                ) 

            }
        )
    }

    return (
        <DialogBox
            open={open}
            title=''
            onClose={onClose}
            onSubmit={handleSubmit}
            submitText="Confirm"
            cancelText="Cancel"
            isSubmitDisabled={updateUserRole.isPending}
            isSubmitting={updateUserRole.isPending}
        >   
            
            <Typography>
                Promote User to Admin?
            </Typography>
        </DialogBox>
    )
}
