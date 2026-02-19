import type { PaletteOptions } from '@mui/material/styles';

import { COLORS } from '@constant';

/* Custom Palette */
export const palette: PaletteOptions = {
    primary: {
        main: COLORS.PRIMARY.MAIN,
    },
    error: {
        main: COLORS.ERROR.LIGHT,
        contrastText: COLORS.ERROR.DARK,
    },
    info: {
        main: COLORS.INFO.LIGHT,
        contrastText: COLORS.INFO.DARK,
    },
    success: {
        main: COLORS.SUCCESS.LIGHT,
        contrastText: COLORS.SUCCESS.DARK,
    },
    common: {
        black: COLORS.COMMON.BLACK,
        white: COLORS.COMMON.WHITE,
    },
    text: {
        primary: COLORS.GRAY.PRIMARY,
        secondary: COLORS.GRAY.SECONDARY,
    },
    background: {
        default: COLORS.GRAY.BACKGROUND,
    },
};
