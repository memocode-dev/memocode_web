import {Outlet} from "react-router-dom";
import React, {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import MemoSideBar from "@/components/memos/sidebar/MemoSideBar.tsx";
import DoubleLeftArrow from "@/components/common/icons/DoubleLeftArrow.tsx";
import DoubleRightArrow from "@/components/common/icons/DoubleRightArrow.tsx";
import {MemoProvider} from "@/context/MemoContext.tsx";

const minSideBarWidth = 300; // 최소 사이드바 길이
const maxSideBarWidth = 1500; // 최대 사이드바 길이

const MemoCommon = () => {
    const {user_info} = useContext(UserContext);

    const [isDragging, setIsDragging] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarWidth, setSidebarWidth] = useState(300);

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

    if (user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS") {
        return (
            <div>로그인 후 이용가능하다</div>
        )
    }

    return (
        <MemoProvider>
            <div className="flex-1 flex overflow-hidden"
                 onMouseMove={onDrag}
                 onMouseUp={stopDragging} onMouseLeave={stopDragging}>

                {/* 사이드 바 */}
                <div className="fixed flex h-screen bg-white dark:bg-[#1E1E1E] z-10"
                     style={{width: `${sidebarWidth}px`}}>

                    <MemoSideBar sidebarOpen={sidebarOpen}/>

                    {/* 사이드 바 열기/닫기 버튼 */}
                    <div className="flex">
                        <div className="absolute top-1.5 -right-10 flex mx-1 select-none" onClick={openSidebarHandler}>
                            <div
                                className="flex justify-center items-center bg-neutral-400 bg-opacity-80 px-1 mt-1 h-7 rounded-sm text-white hover:text-neutral-700 cursor-pointer">
                                {sidebarOpen ? <DoubleLeftArrow/> : <DoubleRightArrow/>}
                            </div>
                        </div>
                    </div>

                    {/* 사이드바 넓이 조정 줄 */}
                    <div
                        className={`w-0.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 ${sidebarOpen ? "" : "hidden"} z-[2000]`}
                        style={{cursor: "ew-resize"}}
                        onMouseDown={startDragging}
                    ></div>
                </div>

                {/* 메인 시작 */}
                <div className="flex-1 flex flex-col" style={{marginLeft: `${sidebarWidth}px`}}>
                    <Outlet/>
                </div>
            </div>
        </MemoProvider>

    )
}

export default MemoCommon;