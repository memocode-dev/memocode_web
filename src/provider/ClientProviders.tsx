'use client';

import {ReactNode, Suspense, useEffect} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {KeycloakProvider, useKeycloak} from '@/context/KeycloakContext';
import {ModalProvider} from '@/context/ModalContext';
import {ThemeProvider} from '@/context/ThemeContext';
import LoadingPage from '@/pages/loading/LoadingPage';

interface ClientProvidersProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

const ClientProviders = ({children}: ClientProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <ToastContainer/>
                <KeycloakProvider>
                    <ModalProvider>
                        <Suspense fallback={<LoadingPage/>}>
                            {children}
                        </Suspense>
                    </ModalProvider>
                </KeycloakProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default ClientProviders;
