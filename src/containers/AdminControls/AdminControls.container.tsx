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
    lastJsonMessage,
    isRevealed,
}: AdminControlsProps) => {

    const [selectedValue, setSelectedValue] = useState<string>("");
    const [isConfirming, setIsConfirming] = useState(false);

    const votes = participants
        .map((p) => p.estimate)
        .filter((e): e is number => typeof e === "number");

    const hasAnyoneVoted = votes.length > 0;

    const maxVote = votes.length > 0
        ? votes.reduce((acc, current, _, arr) =>
            arr.filter(v => v === current).length > arr.filter(v => v === acc).length
                ? current
                : acc
            , votes[0])
        : null;

    const isDisabled = !activeTicketId;

    const handleConfirm = () => {
        setIsConfirming(true);
        onConfirm(Number(selectedValue));
    };

    useEffect(() => {
        if (maxVote !== null && allowedValues.includes(maxVote)) {
            setSelectedValue(maxVote.toString());
        }
    }, [maxVote, allowedValues]);

    useEffect(() => {
        setIsConfirming(false);
    }, [activeTicketId]);

    useEffect(() => {
        if (lastJsonMessage?.event === "SUCCESS") {
            setIsConfirming(false);
        }
        if (lastJsonMessage?.event === "ERROR") {
            setIsConfirming(false);
        }
    }, [lastJsonMessage]);

    return (
        <Stack spacing={2}>

            <Button
                variant="contained"
                color="info"
                disabled={isDisabled || !hasAnyoneVoted || isRevealed}
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
                    disabled={isDisabled || !selectedValue || isConfirming}
                    onClick={handleConfirm}
                >
                    {isConfirming ? "Confirming" : "Confirm"}
                </Button>
            </Box>

        </Stack>
    );
};
