import { createRoot } from 'react-dom/client';
import './index.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import App from './App';
import theme from './theme';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <>
    {/* Inject the initial color mode */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </>
);
