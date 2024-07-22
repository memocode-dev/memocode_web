'use client';

import {ReactNode, Suspense, useEffect} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useKeycloak} from '@/context/KeycloakContext';
import {ModalProvider} from '@/context/ModalContext';
import {ThemeProvider} from '@/context/ThemeContext';
import TopBar from '@/components/common/TopBar';
import BottomBar from '@/components/common/BottomBar';
import {usePathname} from 'next/navigation';
import LoadingPage from '@/pages/loading/LoadingPage';
import dynamic from 'next/dynamic';

const RequiredLoginPage = dynamic(() => import('@/pages/error/RequiredLoginPage'), {
    ssr: false
});

const KeycloakProvider = dynamic(() => import('@/context/KeycloakContext').then(mod => mod.KeycloakProvider), {
    ssr: false
});

interface ClientProvidersProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

const ClientProviders = ({children}: ClientProvidersProps) => {

    const pathname = usePathname();
    const isWRoute = pathname?.startsWith('/w') || false; // boolean으로 타입 변환

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <KeycloakProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <ToastContainer/>
                    {/*<KeycloakProvider>*/}
                    <ModalProvider>
                        <Suspense fallback={<LoadingPage/>}>
                            <InnerComponent isWRoute={isWRoute}>
                                {children}
                            </InnerComponent>
                        </Suspense>
                    </ModalProvider>
                    {/*</KeycloakProvider>*/}
                </ThemeProvider>
            </QueryClientProvider>
        </KeycloakProvider>
    );
};

interface InnerComponentProps {
    isWRoute: boolean;
    children: ReactNode;
}

const InnerComponent = ({isWRoute, children}: InnerComponentProps) => {

    const {isLogined} = useKeycloak();

    if (!isLogined && isWRoute) {
        return <RequiredLoginPage/>;
    }

    return (
        <>
            {!isWRoute && <TopBar/>}
            {children}
            {!isWRoute && <BottomBar/>}
        </>
    );
};

export default ClientProviders;
