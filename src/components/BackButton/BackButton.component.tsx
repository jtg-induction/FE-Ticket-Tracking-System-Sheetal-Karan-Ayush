import { useNavigate } from "react-router-dom";

import { ArrowBack } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

import { BackButtonProps } from "./BackButton.types";

export const BackButton = ({ onClick }: BackButtonProps) => {
    const navigate = useNavigate();

    return (
        <Tooltip title="Go Back">
            <IconButton onClick={onClick ? onClick : () => void navigate(-1)}>
                <ArrowBack />
            </IconButton>
        </Tooltip>
    );
};
