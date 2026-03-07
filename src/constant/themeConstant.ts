/**
 * Color palette used in the application.
 * @constant
 */
export const COLORS = {
    PRIMARY: {
        MAIN: '#0E9F6E',
    },
    GRAY: {
        PRIMARY: '#111827',
        SECONDARY: '#6B7280',
        BACKGROUND: '#F9FAFA',
    },
    ERROR: {
        DARK: '#9B1C1C',
        MAIN: '#F05252',
        LIGHT: '#FBD5D5',
    },
    INFO: {
        DARK: '#1E429F',
        MAIN: '#3F83F8',
        LIGHT: '#E1EFFE',
    },
    SUCCESS: {
        DARK: '#03543F',
        LIGHT: '#DEF7EC',
    },
    COMMON: {
        WHITE: '#FFFFFF',
        BLACK: '#000000',
    },
};

/**
 * Font Types
 * @constant
 */
export const PRIMARY_FONT = `'Inter'`;
export const FALLBACK_FONTS = 'sans-serif';

/**
 * Base font size percentage
 * @constant
 */
export const HTML_FONT_SIZE_PERCENTAGE = 62.5;

/**
 * Base font size in pixels.
 * @constant
 */
export const HTML_FONT_SIZE = (HTML_FONT_SIZE_PERCENTAGE / 100) * 16;

/**
 * Scaling factor used for spacing.
 * @constant
 */
export const SCALING_FACTOR = 4;

/**
 * Font Weights
 * @constant
 */
export const FONT_WEIGHTS = {
    LIGHT: 300,
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
};

/**
 * Font Sizes
 * @constant
 */
export const FONT_SIZES = {
    FONT_XS: 12,
    FONT_SM: 14,
    FONT_BASE: 16,
    FONT_XL: 20,
    FONT_3XL: 30,
    FONT_5XL: 48,
};
