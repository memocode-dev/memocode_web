// 'use client';
//
// import {ReactNode, Suspense, useEffect} from 'react';
// import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
// import {ToastContainer} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {useKeycloak} from '@/context/KeycloakContext';
// import {ModalProvider} from '@/context/ModalContext';
// import {ThemeProvider} from '@/context/ThemeContext';
// import TopBar from '@/components/common/TopBar';
// import BottomBar from '@/components/common/BottomBar';
// import {usePathname} from 'next/navigation';
// import LoadingPage from '@/pages/loading/LoadingPage';
// import dynamic from 'next/dynamic';
//
// const RequiredLoginPage = dynamic(() => import('@/pages/error/RequiredLoginPage'), {
//     ssr: false
// });
//
// const KeycloakProvider = dynamic(() => import('@/context/KeycloakContext').then(mod => mod.KeycloakProvider), {
//     ssr: false
// });
//
// interface ClientProvidersProps {
//     children: ReactNode;
// }
//
// const queryClient = new QueryClient();
//
// const ClientProviders = ({children}: ClientProvidersProps) => {
//
//     const pathname = usePathname();
//     const isWRoute = pathname?.startsWith('/w') || false; // boolean으로 타입 변환
//
//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, [pathname]);
//
//     return (
//         <QueryClientProvider client={queryClient}>
//             <ThemeProvider>
//                 <ToastContainer/>
//                 <KeycloakProvider>
//                     <ModalProvider>
//                         <Suspense fallback={<LoadingPage/>}>
//                             <InnerComponent isWRoute={isWRoute}>
//                                 {children}
//                             </InnerComponent>
//                         </Suspense>
//                     </ModalProvider>
//                 </KeycloakProvider>
//             </ThemeProvider>
//         </QueryClientProvider>
//     );
// };
//
// interface InnerComponentProps {
//     isWRoute: boolean;
//     children: ReactNode;
// }
//
// const InnerComponent = ({isWRoute, children}: InnerComponentProps) => {
//
//     const {isLogined} = useKeycloak();
//
//     if (!isLogined && isWRoute) {
//         return <RequiredLoginPage/>;
//     }
//
//     return (
//         <>
//             {!isWRoute && <TopBar/>}
//             {children}
//             {!isWRoute && <BottomBar/>}
//         </>
//     );
// };
//
// export default ClientProviders;

'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React, {Suspense, useState} from 'react';
import dynamic from "next/dynamic";
// import {ThemeProvider} from "@/context/ThemeContext";
// import {ToastContainer} from "react-toastify";
// import {ModalProvider} from "@/context/ModalContext";
import LoadingPage from "@/pages/loading/LoadingPage";
const KeycloakProvider = dynamic(() => import('@/context/KeycloakContext').then(mod => mod.KeycloakProvider), {
    ssr: false
});
const ThemeProvider = dynamic(() => import('@/context/ThemeContext').then(mod => mod.ThemeProvider), {
    ssr: false
});
const ModalProvider = dynamic(() => import('@/context/ModalContext').then(mod => mod.ModalProvider), {
    ssr: false
});
const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), {
    ssr: false
});

export default function ClientProviders({
                                               children,
                                           }: React.PropsWithChildren) {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false,
                    refetchOnMount: false,
                    retry: 1,
                },
            },
        }),
    );

    return (
        <QueryClientProvider client={client}>
            <ThemeProvider>
                <ToastContainer/>
                <KeycloakProvider>
                    <ModalProvider>
                        <Suspense fallback={<LoadingPage/>}>
                            {/*<InnerComponent isWRoute={isWRoute}>*/}
                                {children}
                            {/*</InnerComponent>*/}
                        </Suspense>
                    </ModalProvider>
                </KeycloakProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}