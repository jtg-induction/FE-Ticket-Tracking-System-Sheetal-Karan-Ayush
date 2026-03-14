import React from 'react';

import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';

import { SelectInputProps } from './SelectInput.types';

export const SelectInput: React.FC<SelectInputProps> = ({
    label,
    value,
    onChange,
    options,
    name,
    helperText,
    error = false,
    fullWidth = true,
    required = true,
}) => (
    <FormControl fullWidth={fullWidth} required={required} error={error}>
        <InputLabel>{label}</InputLabel>
        <Select
            label={label}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            name={name ?? ''}
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
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
);
