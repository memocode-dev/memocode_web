import {Outlet} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {MemoProvider} from "@/context/MemoContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import DoubleLeftArrow from "@/components/ui/icons/DoubleLeftArrow.tsx";
import DoubleRightArrow from "@/components/ui/icons/DoubleRightArrow.tsx";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import MemoWritePageLayout__SideBar from "@/page_components/memo_write_page_layout/MemoWritePageLayout__SideBar.tsx";
import MemoWritePageLayout__CreateMemoDetailInfoModal
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__modals/MemoWritePageLayout__CreateMemoDetailInfoModal.tsx";

const minSideBarWidth = 300; // 최소 사이드바 길이
const maxSideBarWidth = 1500; // 최대 사이드바 길이

const MemoWritePageLayout = () => {

    const {login, isLogined} = useKeycloak()

    const [isDragging, setIsDragging] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [width, setWidth] = useState(window.innerWidth);

    // 드래그 시작 처리 함수
    const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    // 드래그 중 처리 함수
    const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            let newWidth = e.clientX;
            if (newWidth > maxSideBarWidth) {
                newWidth = maxSideBarWidth;
            } else {
                newWidth = Math.max(newWidth, minSideBarWidth);
            }
            setSidebarWidth(newWidth);
        }
    }

    // 드래그 종료 처리 함수
    const stopDragging = () => {
        setIsDragging(false);
    }

    // 사이드바 열고 닫는 함수
    const openSidebarHandler = () => {
        setSidebarOpen(prevOpen => !prevOpen);
        setSidebarWidth(prevWidth => prevWidth === 0 ? minSideBarWidth : 0);
    }

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        if (width <= 640) {
            setSidebarOpen(false)
            setSidebarWidth(0)
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isLogined) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center space-y-3">
                <div className="font-semibold tracking-wide">로그인 후 이용가능합니다.</div>
                <Button onClick={() => login()}>로그인 창으로 이동</Button>
            </div>
        )
    }

    const MemoWritePageLayout__SideBar__Open_And_Close_Button = (
        <div className="absolute top-1.5 -right-10 flex mx-1 select-none" onClick={openSidebarHandler}>
            <div
                className="flex justify-center items-center bg-neutral-400 bg-opacity-80 px-1 mt-1 h-7 rounded-sm text-white hover:text-neutral-700 cursor-pointer">
                {sidebarOpen ? <DoubleLeftArrow/> : <DoubleRightArrow/>}
            </div>
        </div>
    )

    const MemoWritePageLayout__SideBar__ControlLine = (
        <div
            className={`w-0.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 ${sidebarOpen ? "" : "hidden"} z-[2000]`}
            style={{cursor: "ew-resize"}}
            onMouseDown={startDragging}
        ></div>
    )

    return (
        <MemoProvider>
            <div
                className="flex-1 flex overflow-hidden"
                onMouseMove={onDrag}
                onMouseUp={stopDragging} onMouseLeave={stopDragging}
            >
                <div className="fixed flex h-screen bg-background z-10" style={{width: `${sidebarWidth}px`}}>
                    <MemoWritePageLayout__SideBar sidebarOpen={sidebarOpen}/>

                    <div className="flex">{MemoWritePageLayout__SideBar__Open_And_Close_Button}</div>

                    {MemoWritePageLayout__SideBar__ControlLine}
                </div>

                <div className="flex-1 flex flex-col" style={{marginLeft: `${sidebarWidth}px`}}>
                    <Outlet/>
                </div>
            </div>
            <MemoWritePageLayout__CreateMemoDetailInfoModal />
        </MemoProvider>
    )
}

export default MemoWritePageLayout;