
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


declare module '@mui/material/styles' {
  interface Theme {
    shadow: typeof SHADOWS;
  }
  interface ThemeOptions {
    shadow?: typeof SHADOWS;
  }
}