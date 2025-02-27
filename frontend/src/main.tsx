import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { MantineProvider } from '@mantine/core';
import App from './App.tsx';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <MantineProvider>
                <App />
            </MantineProvider>
        </Provider>
    </StrictMode>,
);
