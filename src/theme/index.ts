import { createTheme } from '@mui/material/styles';

import { PRIMARY_FONT, SCALING_FACTOR, SHADOWS } from '@constant';

/* Customized MUI components themes */
import { components } from './components';
/* Customized foundation themes */
import { breakpoints, mixins, palette, typography } from './foundations';

/* 
Initialize the theme with base theme elements (excluding typography styles and spacing to ensure the theme has correct breakpoints and pxToRem function set.)
*/
const baseTheme = createTheme({
    palette,
    breakpoints,
    mixins,
    components,
    typography: {
        fontFamily: `${PRIMARY_FONT}`,
        ...typography.typographyUtil,
    },
    spacing: (factor: number) =>
        theme.typography.pxToRem(factor * SCALING_FACTOR),
    shadow: SHADOWS,
});

const theme = createTheme(baseTheme, {
    typography: {
        ...typography.typographyStyle(baseTheme),
    },
});

export { theme };
