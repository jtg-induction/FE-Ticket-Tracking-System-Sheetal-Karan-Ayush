import type { Theme } from '@mui/material/styles';
import type {
    TypographyOptions,
    TypographyUtils,
} from '@mui/material/styles/createTypography';

import {
    FALLBACK_FONTS,
    FONT_SIZES,
    FONT_WEIGHTS,
    HTML_FONT_SIZE,
    PRIMARY_FONT,
} from '@constant';

/* Custom px to rem function */
const typographyUtil: TypographyUtils = {
    /**
     * Converts a pixel value to rem units.
     * @param px - The pixel value to convert.
     * @returns The equivalent value in rem units as a string.
     */
    pxToRem: (px: number) => `${px / HTML_FONT_SIZE}` + 'rem',
};

/**
 * Creates a typography block with various styles
 * @param theme - Theme object to access the breakpoints.
 * @returns The function returns a TypographyOptions object, which includes various typography settings,
 */
const typographyStyle = (theme: Theme): TypographyOptions => ({
    fontFamily: `${PRIMARY_FONT}, ${FALLBACK_FONTS}`,
    htmlFontSize: HTML_FONT_SIZE,

    h1: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_3XL),
        fontWeight: FONT_WEIGHTS.BOLD,
        lineHeight: typographyUtil.pxToRem(45),

        [theme.breakpoints.up('md')]: {
            fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_5XL),
            lineHeight: typographyUtil.pxToRem(62.5),
        },
    },

    h2: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_XL),
        fontWeight: FONT_WEIGHTS.BOLD,
        lineHeight: typographyUtil.pxToRem(25),

        [theme.breakpoints.up('md')]: {
            fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_XL),
            lineHeight: typographyUtil.pxToRem(30),
        },
    },

    h3: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_BASE),
        fontWeight: FONT_WEIGHTS.SEMIBOLD,
        lineHeight: typographyUtil.pxToRem(24),

        [theme.breakpoints.up('md')]: {
            fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_XL),
            lineHeight: typographyUtil.pxToRem(30),
        },
    },

    h4: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_SM),
        fontWeight: FONT_WEIGHTS.SEMIBOLD,
        lineHeight: typographyUtil.pxToRem(21),

        [theme.breakpoints.up('md')]: {
            fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_BASE),
            lineHeight: typographyUtil.pxToRem(24),
        },
    },

    h5: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_XS),
        fontWeight: FONT_WEIGHTS.LIGHT,
        lineHeight: typographyUtil.pxToRem(18),

        [theme.breakpoints.up('md')]: {
            fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_SM),
            lineHeight: typographyUtil.pxToRem(21),
        },
    },

    body1: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_BASE),
        fontWeight: FONT_WEIGHTS.NORMAL,
        lineHeight: typographyUtil.pxToRem(24),
    },

    body2: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_SM),
        fontWeight: FONT_WEIGHTS.NORMAL,
        lineHeight: typographyUtil.pxToRem(20),
    },

    subtitle1: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_BASE),
        fontWeight: FONT_WEIGHTS.MEDIUM,
        lineHeight: typographyUtil.pxToRem(24),
    },

    subtitle2: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_SM),
        fontWeight: FONT_WEIGHTS.NORMAL,
        lineHeight: typographyUtil.pxToRem(40),
    },

    caption: {
        fontSize: typographyUtil.pxToRem(FONT_SIZES.FONT_XS),
        fontWeight: FONT_WEIGHTS.NORMAL,
        lineHeight: typographyUtil.pxToRem(18),
    },
});

export const typography = { typographyStyle, typographyUtil };
