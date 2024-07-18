'use client'

import {useEffect, useState} from "react";
import {RxDoubleArrowLeft, RxDoubleArrowRight} from "react-icons/rx";
import {useSidebar} from "@/context/SideBarContext";
import MyMemoSideBar from "@/page_components/myMemo/layout/MyMemoSideBar";
import MyMemoCreateDetailInfoModal from "@/page_components/myMemo/toolbar/MyMemoCreateDetailInfoModal";

const minSideBarWidth = 300; // 최소 사이드바 길이
const maxSideBarWidth = 1500; // 최대 사이드바 길이

const MyMemoLayout = () => {

    const [isDragging, setIsDragging] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const {sidebarWidth, setSidebarWidth} = useSidebar()
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
            setSidebarWidth(() => newWidth);
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
            setSidebarWidth(() => 0)
        }

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const SideBarOpenAndCloseButton = (
        <div className="absolute top-1.5 -right-10 flex mx-1 select-none" onClick={openSidebarHandler}>
            <div
                className="flex justify-center items-center bg-neutral-400 bg-opacity-80 px-1 mt-1 h-7 rounded-sm text-white hover:text-neutral-700 cursor-pointer">
                {sidebarOpen ? <RxDoubleArrowLeft className="w-5 h-5"/> : <RxDoubleArrowRight className="w-5 h-5"/>}
            </div>
        </div>
    )

    const SideBarControlLine = (
        <div
            className={`w-0.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 ${sidebarOpen ? "" : "hidden"} z-[2000]`}
            style={{cursor: "ew-resize"}}
            onMouseDown={startDragging}
        ></div>
    )

    return (
        <>
            <div onMouseMove={onDrag}
                 onMouseUp={stopDragging} onMouseLeave={stopDragging}
            >
                <div className="fixed flex h-screen bg-background z-10" style={{width: `${sidebarWidth}px`}}>
                    <MyMemoSideBar sidebarOpen={sidebarOpen}/>

                    <div className="flex">{SideBarOpenAndCloseButton}</div>

                    {SideBarControlLine}
                </div>
            </div>

            <MyMemoCreateDetailInfoModal/>
        </>
    )
}

export default MyMemoLayout;