import { Chip } from "@mui/material";
import { EnumChipProps } from "./EnumChip.types";

export const EnumChip = ({value,map}: EnumChipProps) => {
    const config = map[value];

    if(!config){
        return <Chip label="Unknown"/>
    }

    return(
        <Chip
            label={config.label}
            color={config.color}
            variant="filled"
        />
    )
}