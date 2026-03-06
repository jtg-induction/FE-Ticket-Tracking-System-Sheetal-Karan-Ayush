import { Box, Chip, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { EnumSelectProps } from "./EnumSelect.types";

export const EnumSelect = (
    { value, map, onChange }: EnumSelectProps
) => {
    const handleChange = (e: SelectChangeEvent<number>) => {
        onChange(Number(e.target.value));
    };

    return (
        <Select
            value={value}
            onChange={handleChange}
            variant="standard"
            disableUnderline
            renderValue={(selected) => {
                const config = map[selected];
                return (
                    <Chip
                        label={config.label}
                        color={config.color}
                    />
                );
            }}
        >

            {Object.entries(map).map(([key, config]) => (
                <MenuItem key={key} value={Number(key)}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip
                            label={config.label}
                            color={config.color}
                        />
                    </Box>
                </MenuItem>
            ))}


        </Select>


    )
}