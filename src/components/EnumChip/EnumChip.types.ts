import { ChipProps } from "@mui/material";

export type EnumChipProps = {
    value: number;
    map: Record<number, {label: string; color: ChipProps['color']}>;
}