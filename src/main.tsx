import { createRoot } from 'react-dom/client'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.tsx'
import theme from "./theme";

createRoot(document.getElementById('root')!).render(
 
    <ChakraProvider theme={theme}>
    <App />
    </ChakraProvider>
 
)
