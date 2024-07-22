'use client'

import {ReactNode} from "react";
import {useKeycloak} from "@/context/KeycloakContext";
import RequiredLoginPage from "@/pages/error/RequiredLoginPage";
import TopBar from "@/components/common/TopBar";
import BottomBar from "@/components/common/BottomBar";

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

export default InnerComponent;