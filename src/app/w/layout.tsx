import {MemoProvider} from "@/context/MemoContext";
import MyMemoLayout from "@/page_components/myMemo/MyMemoLayout";
import {SidebarProvider, useSidebar} from "@/context/SideBarContext";
import RequiredLoginPage from "@/pages/error/RequiredLoginPage";
import {useKeycloak} from "@/context/KeycloakContext";

export default function WLayout({
                                    children,
                                }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <MemoProvider>
            <SidebarProvider>
                <div className="flex-1 flex overflow-hidden">
                    <MyMemoLayout/>

                    {children}
                </div>
            </SidebarProvider>
        </MemoProvider>
    );
}