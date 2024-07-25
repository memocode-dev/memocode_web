import {MemoProvider} from "@/context/MemoContext";
import {SidebarProvider} from "@/context/SideBarContext";
import MyMemoLayout from "@/components/page_components/myMemo/MyMemoLayout";

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