import { Button, Stack } from "@mui/material";

import { EstimationDeckProps } from "./EstimationType.types";


export const EstimationDeck = ({ options, onVote, activeTicketId }: EstimationDeckProps) => {
    const isDisabled = !activeTicketId;

    return (
        <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            sx={{ padding: 1 }}
        >
            {options.map((val) => (
                <Button
                    key={val}
                    variant="contained"
                    color="primary"
                    disabled={isDisabled}
                    sx={{ 
                        minHeight: 80,
                    }}
                    onClick={() => onVote(val)}
                >
                    {val}
                </Button>
            ))}
        </Stack>
    );
};
