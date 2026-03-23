import type { Components } from '@mui/material/styles';

// Local Font files
import InterVariableTTF from '@assets/fonts/inter/Inter-VariableFont_opsz,wght.ttf';
import InterVariableWOFF2 from '@assets/fonts/inter/Inter-VariableFont_opsz,wght.woff2';

const fontFaceDeclarations = `
      @font-face {
        font-display: swap; 
        font-family: 'Inter';
        src: url(${InterVariableWOFF2}) format('woff2'), 
        url(${InterVariableTTF}) format('truetype');
      };
    `;

export const components: Components = {
    MuiCssBaseline: {
        styleOverrides: {
            '@font-face': fontFaceDeclarations,
            html: {
                fontSize: '62.5%',
            },
        },
    },
};
