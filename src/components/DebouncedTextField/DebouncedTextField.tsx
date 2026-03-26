import React, { useCallback, useEffect, useRef, useState } from 'react';

import debounce from 'lodash/debounce';

import { TextField } from '@mui/material';

import { DebouncedSearchFieldProps } from './DebouncedTextField.type';

export const DebouncedSearchField: React.FC<DebouncedSearchFieldProps> = ({
    value: externalValue,
    delay = 500,
    onChange,
    ...textFieldProps
}) => {
    const [internalValue, setInternalValue] = useState(externalValue || '');
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const debouncedOnChange = useCallback(
        debounce((newValue: string) => {
            onChangeRef.current(newValue);
        }, delay),
        [],
    );

    useEffect(() => {
        setInternalValue(externalValue || '');
    }, [externalValue]);

    useEffect(
        () => () => {
            debouncedOnChange.cancel();
        },
        [debouncedOnChange],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalValue(newValue);
        debouncedOnChange(newValue);
    };

    return (
        <TextField
            {...textFieldProps}
            value={internalValue}
            onChange={handleChange}
        />
    );
};
