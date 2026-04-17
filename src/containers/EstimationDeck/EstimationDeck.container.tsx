import { Button, Stack } from "@mui/material";

import { EstimationDeckProps } from "./EstimationType.types";


export const EstimationDeck = ({ options, onVote, activeTicketId, participants, currentUserId }: EstimationDeckProps) => {

    const currentUserVote = participants?.find(p => p.user_id === currentUserId)?.estimate;
    const currentUserRole = participants?.find(p => p.user_id === currentUserId)?.role;
    const isDisabled = !activeTicketId || (currentUserRole == 3);

    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ padding: 1 }}
        >
            {options.map((val) => {
                const isSelected = currentUserVote === val;
                return (
                    <Button
                        key={val}
                        variant="contained"
                        color="primary"
                        disabled={isDisabled || isSelected}
                        sx={{
                            minHeight: 80,
                        }}
                        onClick={() => onVote(val)}
                    >
                        {val}
                    </Button>
                );
            })}
        </Stack>
    );
};
