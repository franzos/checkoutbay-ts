import { colorsTuple, createTheme, MantineTheme, virtualColor } from '@mantine/core';

// Custom CSS variables resolver to properly override Mantine's background variables
export const cssVariablesResolver = (theme: MantineTheme) => ({
  variables: {
    // Variables that don't change between color schemes
    '--mantine-scale': theme.scale.toString(),
  },
  light: {
    // Light mode background overrides
    '--mantine-color-body': theme.other.neutralLight, // Use checkoutbay's ivory color
    '--mantine-color-default': theme.white,
    '--mantine-color-default-hover': '#f0f0f0',
    '--mantine-color-default-border': '#e0e0e0',
  },
  dark: {
    // Dark mode background overrides - DARKER values for high contrast
    '--mantine-color-body': '#0a0a0b',              // Very dark background
    '--mantine-color-default': '#141517',           // Dark surface
    '--mantine-color-default-hover': '#1a1b1e',     // Slightly lighter on hover
    '--mantine-color-default-border': '#2c2e33',    // Subtle borders

    // Override specific dark color variables that components use - DARKER
    '--mantine-color-dark-6': '#141517',            // Card backgrounds (darker)
    '--mantine-color-dark-7': '#0a0a0b',            // Main backgrounds (very dark)
    '--mantine-color-dark-5': '#1a1b1e',            // Hover states
    '--mantine-color-dark-4': '#2c2e33',            // Borders
    '--mantine-color-dark-8': '#050506',            // Deep backgrounds (nearly black)
  }
});

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
