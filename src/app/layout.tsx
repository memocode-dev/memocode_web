// import type {Metadata} from "next";
// import {Inter as FontSans} from 'next/font/google';
// import '../css/globals.css';
// import {cn} from '@/lib/utils';
// import dynamic from 'next/dynamic';
// import {useKeycloak} from "@/context/KeycloakContext";
// import TopBar from "@/components/common/TopBar";
// import BottomBar from "@/components/common/BottomBar";
// import {usePathname} from "next/navigation";
// import RequiredLoginPage from "@/pages/error/RequiredLoginPage";
//
// const ClientProviders = dynamic(() => import('@/provider/ClientProviders'), {
//     ssr: false
// });
//
// const fontSans = FontSans({
//     subsets: ['latin'],
//     variable: '--font-sans',
// });
//
// export const metadata: Metadata = {
//     title: '메모코드',
//     description: '메모코드',
// };
//
// export default function MainLayout({
//                                        children,
//
//                                    }: Readonly<{
//     children: React.ReactNode;
// }>) {
//
//     const pathname = usePathname()
//     const isWRoute = pathname?.startsWith('/w') || false; // boolean으로 타입 변환
//     const {isLogined} = useKeycloak();
//
//     if (!isLogined && isWRoute) {
//         return <RequiredLoginPage/>;
//     }
//
//     return (
//         <html lang="en">
//         <body
//             className={cn(
//                 'h-screen flex flex-col mx-auto bg-background font-sans',
//                 fontSans.variable
//             )}
//         >
//         <ClientProviders>
//             {!isWRoute && <TopBar/>}
//             {children}
//             {!isWRoute && <BottomBar/>}
//             {/*<div className="flex-1 flex">*/}
//             {/*    {children}*/}
//             {/*</div>*/}
//         </ClientProviders>
//         </body>
//         </html>
//     );
// }
// src/app/layout.tsx

import type {Metadata} from "next";
import {Inter as FontSans} from 'next/font/google';
import '../css/globals.css';
import {cn} from '@/lib/utils';
import dynamic from 'next/dynamic';
import Layout from "@/page_components/Layout";

const ClientProviders = dynamic(() => import('@/provider/ClientProviders'), {
    ssr: false
});

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: '메모코드',
    description: '메모코드',
};

export default function AppLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={cn(
                'h-screen flex flex-col mx-auto bg-background font-sans overflow-x-hidden',
                fontSans.variable
            )}
        >
        <ClientProviders>
            <Layout>{children}</Layout>
        </ClientProviders>
        </body>
        </html>
    );
}
