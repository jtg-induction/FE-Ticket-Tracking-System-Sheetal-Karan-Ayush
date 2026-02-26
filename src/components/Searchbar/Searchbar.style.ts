import { Autocomplete, outlinedInputClasses } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';

import { StyledAutocompleteType } from './Searchbar.types';
export const StyledAutocomplete = styled(Autocomplete)(
    ({
        theme: { spacing, shape, palette, breakpoints, typography },
    }: {
        theme: Theme;
    }) => ({
        flexGrow: 1,
        width: '100%',
        minWidth: typography.pxToRem(400),
        borderRadius: shape.borderRadius * 4,
        backgroundColor: palette.background.default,

        // Style the input container (fieldset + input)
        // Style the OutlinedInput root
        [`& .${outlinedInputClasses.root}`]: {
            borderRadius: shape.borderRadius * 4,
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: palette.background.default,

            // Style the fieldset
            [`& .${outlinedInputClasses.notchedOutline}`]: {
                borderWidth: 1,
            },

            // Hover effect
            '&:hover': {
                [`& .${outlinedInputClasses.notchedOutline}`]: {
                    borderColor: palette.primary.main,
                    borderWidth: 2,
                },
            },

            // Input padding & height
            [`& .${outlinedInputClasses.input}`]: {
                paddingTop: spacing(2),
                paddingBottom: spacing(2),
                height: 'auto',
            },

            // Focus state
            [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                    borderColor: palette.primary.main,
                    borderWidth: 2,
                },
        },

        [breakpoints.down('sm')]: {
            minWidth: typography.pxToRem(200),
        },
    }),
) as StyledAutocompleteType;
