'use client';

import { useKeycloak } from "@/context/KeycloakContext";
import TopBar from "@/components/common/TopBar";
import BottomBar from "@/components/common/BottomBar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import RequiredLoginPage from "@/components/pages/error/RequiredLoginPage";

const Layout = ({ children }: { children: React.ReactNode }) => {

    const pathname = usePathname();
    const isWRoute = pathname?.startsWith('/w') || false; // boolean으로 타입 변환
    const { isLogined } = useKeycloak();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    if (!isLogined && isWRoute) {
        return <RequiredLoginPage />;
    }

    return (
        <>
            {!isWRoute && <TopBar />}
            {children}
            {!isWRoute && <BottomBar />}
        </>
    );
}

export default Layout;