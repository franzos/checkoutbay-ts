import { colorsTuple, createTheme, virtualColor } from '@mantine/core';

export const theme = createTheme({
  colors: {
    'brand-color-primary': colorsTuple('#6A4C93'), // Royal Purple
    'brand-color-secondary': colorsTuple('#3EB489'), // Fresh Mint
    'brand-color-accent': colorsTuple('#FF6F59'), // Coral Orange
    'alert-error': colorsTuple('#D72631'), // Bright Crimson
    primary: virtualColor({
      name: 'primary',
      dark: 'brand-color-primary',
      light: 'brand-color-primary',
    }),
    secondary: virtualColor({
      name: 'secondary',
      dark: 'brand-color-secondary',
      light: 'brand-color-secondary',
    }),
    accent: virtualColor({
      name: 'accent',
      dark: 'brand-color-accent',
      light: 'brand-color-accent',
    }),
    error: virtualColor({
      name: 'error',
      dark: 'alert-error',
      light: 'alert-error',
    }),
  },
  primaryColor: 'primary',
  other: {
    neutralLight: '#F9F6F2', // Ivory
    neutralDark: '#343A40', // Gunmetal Gray
    alertError: '#D72631', // Bright Crimson
  },
});
