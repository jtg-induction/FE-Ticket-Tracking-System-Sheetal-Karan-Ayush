import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';

import { StyledAutocomplete } from './Searchbar.style';
import { BaseOption, SearchbarProps } from './Searchbar.types';

/**
 * Searchbar Component
 * * Provides a specialized search input using MUI Autocomplete.
 * Designed for server-side filtering where options are updated dynamically
 * based on user input.
 */
export const Searchbar = <T extends BaseOption>({
    options,
    optionsLoading,
    value,
    onSelect,
    onSearch,
    getOptionLabel,
    isOptionEqualToValue,
}: SearchbarProps<T>) => (
    <StyledAutocomplete<T, false, false, false>
        // --- Configuration ---
        disableClearable={false}
        options={options}
        value={value}
        loading={optionsLoading}
        popupIcon={null}
        // --- Filtering Logic ---
        /** * Returns items as-is to disable local filtering,
         * allowing the API/parent component to control the results.
         */
        filterOptions={(items: T[]) => items}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        // --- Event Handlers ---
        /** Triggered when an option is selected from the list */
        onChange={(_, newValue) => onSelect?.(newValue)}
        /** Triggered on every keystroke to update the search query */
        onInputChange={(_, newInputValue) => {
            onSearch?.(newInputValue);
        }}
        // --- Input Rendering ---
        renderInput={(params) => (
            <TextField
                {...params}
                placeholder="Search"
                slotProps={{
                    input: {
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    },
                }}
            />
        )}
    />
);
