import { useEffect, useState } from "react";

import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import { AdminControlsProps } from "./AdminControls.types";

export const AdminControls = ({
    activeTicketId,
    onReveal,
    onSkip,
    onConfirm,
    participants,
    allowedValues = [],
}: AdminControlsProps) => {

    const [selectedValue, setSelectedValue] = useState<string>("");

    const votes = participants
        .map((p) => p.estimate)
        .filter((e): e is number => typeof e === "number");
    const maxVote = votes.length > 0 ? Math.max(...votes) : null;

    useEffect(() => {
        if (maxVote !== null && allowedValues.includes(maxVote)) {
            setSelectedValue(maxVote.toString());
        }
    }, [maxVote, allowedValues]);

    const isDisabled = !activeTicketId;

    return (
        <Stack spacing={2}>

            <Button
                variant="contained"
                color="info"
                disabled={isDisabled}
                onClick={onReveal}
            >
                Reveal Votes
            </Button>

            <Button
                color="inherit"
                variant="contained"
                disabled={isDisabled}
                onClick={onSkip}
            >
                Skip Ticket
            </Button>

            <Box display="flex" gap={2} alignItems="center">

                <FormControl fullWidth size="small" disabled={isDisabled}>
                    <InputLabel>Final Points</InputLabel>
                    <Select
                        value={selectedValue}
                        label="Score"
                        onChange={(e) => setSelectedValue(e.target.value)}
                    >
                        {allowedValues.map((val) => (
                            <MenuItem key={val} value={val}>
                                {val} {val === maxVote ? "(Max Vote)" : ""}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="success"
                    disabled={isDisabled || !selectedValue}
                    onClick={() => onConfirm(Number(selectedValue))}
                >
                    Confirm
                </Button>
            </Box>
        </Stack>
    );
};
