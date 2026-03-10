import { ElementType } from 'react';

import { AutocompleteProps } from '@mui/material';
export type BaseOption = Record<number, string>;

export type SearchbarProps<
    T,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
> = {
    options: T[];
    optionsLoading?: boolean;
    value: DisableClearable extends true ? T : T | null;
    onSelect?: (
        value: AutocompleteProps<
            T,
            Multiple,
            DisableClearable,
            FreeSolo
        >['value'],
    ) => void;
    onSearch?: (value: string) => void;
    getOptionLabel: (option: T) => string;
    isOptionEqualToValue?: (option: T, value: T) => boolean;
};

export type StyledAutocompleteType = <
    T,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
    HTMLElementType extends ElementType = 'div',
>(
    props: AutocompleteProps<
        T,
        Multiple,
        DisableClearable,
        FreeSolo,
        HTMLElementType
    >,
) => React.ReactElement;
