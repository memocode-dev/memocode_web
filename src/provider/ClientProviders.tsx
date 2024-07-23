'use client';

import {ReactNode, Suspense} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {KeycloakProvider} from '@/context/KeycloakContext';
import {ModalProvider} from '@/context/ModalContext';
import {ThemeProvider} from '@/context/ThemeContext';
import LoadingPage from "@/components/pages/loading/LoadingPage";

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
