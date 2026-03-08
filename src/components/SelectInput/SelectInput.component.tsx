import React from 'react';

import { FormControl, MenuItem, Select } from '@mui/material';

import { SelectInputProps } from './SelectInput.types';

export const SelectInput: React.FC<SelectInputProps> = ({
    label,
    value,
    onChange,
    options,
    fullWidth = true,
    required = true,
}) => (
    <FormControl fullWidth={fullWidth} required={required}>
        <Select
            label={label}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            notched={false}
        >
            {options.map((opt) => (
                <MenuItem
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.value === 0}
                >
                    {opt.label}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
);
