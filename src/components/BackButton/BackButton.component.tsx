import { useNavigate } from "react-router-dom";

import { ArrowBack } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

export const BackButton = () => {
    const navigate = useNavigate();

    return (
        <Tooltip title="Go Back">
            <IconButton onClick={() => void navigate(-1)}>
                <ArrowBack />
            </IconButton>
        </Tooltip>
    );
};
