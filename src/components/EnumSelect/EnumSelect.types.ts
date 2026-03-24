import { ChipProps } from '@mui/material';

type EnumMap = Record<number, { label: string; color: ChipProps['color'] }>;

export type EnumSelectProps = {
    value: number;
    map: EnumMap;
    onChange: (value: number) => void;
};
