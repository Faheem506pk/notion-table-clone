import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Define the color mode configuration
const config: ThemeConfig = {
  initialColorMode: 'light', // Default color mode
  useSystemColorMode: false, // Use the system's color mode preference
};

// Extend the theme with custom configurations
const theme = extendTheme({ config });

export default theme;
