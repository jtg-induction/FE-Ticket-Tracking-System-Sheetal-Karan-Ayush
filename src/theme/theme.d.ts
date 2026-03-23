export declare module '@mui/material/styles/createMixins' {
    interface Mixins {
        lineClamp: (lines: number) => CSSProperties;
    }
}

export declare module '@mui/material/styles' {
    interface Palette {
        gradients: {
            primary: string;
        };
    }
    interface PaletteOptions {
        gradients?: {
            primary?: string;
        };
    }
}
