import { useParams } from "react-router-dom";

import { Typography } from "@mui/material";

import { DialogBox } from "@components/DialogBox";
import { useSubscribeTicketMutation } from "@features/ticket/subscribeTicket/subscribeTicketMutation";
import { useUnSubscribeTicketMutation } from "@features/ticket/subscribeTicket/unSubscribeTicketMutation";
import { theme } from "@theme";

import { SubscribeTicketProps } from "./subscribeTicket.types";

export const SubscribeTicketDialog = ({open, onClose, isSubscribed}: SubscribeTicketProps) => {

    const subscribeTicketMutation = useSubscribeTicketMutation();
    const unSubscribeTicketMutation = useUnSubscribeTicketMutation();
    const { projectKey, ticketKey } = useParams<{
        projectKey: string;
        ticketKey: string;
    }>();

    const handleSubscribeTicket = () => {
        if(isSubscribed) {
            unSubscribeTicketMutation.mutate(
                {   
                    project_key: projectKey as string, 
                    ticket_key: ticketKey as string, 
                }, 
                {
                    onSuccess: () => onClose(),
                }
            )
        }
        else {
            subscribeTicketMutation.mutate(
            {   
                project_key: projectKey as string, 
                ticket_key: ticketKey as string, 
            }, 
            {
                onSuccess: () => onClose(),
            })
        }
    }

    return (
        <DialogBox
            open={open}
            title=''
            onClose={onClose}
            onSubmit={handleSubscribeTicket}
            submitText="Confirm"
            cancelText="Cancel"
            isSubmitDisabled={subscribeTicketMutation.isPending || unSubscribeTicketMutation.isPending}
            isSubmitting={subscribeTicketMutation.isPending || unSubscribeTicketMutation.isPending}
        >   
            {isSubscribed ?(
                    <Typography>
                        UnSubscribe to Ticket?
                    </Typography>
                ):(
                <Typography>
                    Subscribe to Ticket?
                </Typography>
                )
            }
            {subscribeTicketMutation.isError && (
                <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.error.contrastText }}
                >
                    {subscribeTicketMutation.error.message}
                </Typography>
            )}
            {isSubscribed && subscribeTicketMutation.isSuccess && (
                <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.success.contrastText }}
                >
                    Subsribed successfully
                </Typography>
            )}
            {unSubscribeTicketMutation.isError && (
                <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.error.contrastText }}
                >
                    {unSubscribeTicketMutation.error.message}
                </Typography>
            )}
            {!isSubscribed && unSubscribeTicketMutation.isSuccess && (
                <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.success.contrastText }}
                >
                    UnSubscribed successfully
                </Typography>
            )}
        </DialogBox>
    )
}
