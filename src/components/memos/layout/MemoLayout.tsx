import React, {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import MemoSideBar from "@/components/memos/sidebar/MemoSideBar.tsx";
import MemoCreatePage from "@/pages/w/MemoCreatePage.tsx";


interface MemoLayoutProps {
    children: React.ReactNode;
}

const MemoLayout = ({children}: MemoLayoutProps) => {

    const {user_info} = useContext(UserContext)

    const minSideBarWidth = 300; // 최소 사이드바 길이
    const maxSideBarWidth = 1500; // 최대 사이드바 길이

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

    if (user_info.authority === "NOT_LOGIN") {
        return (
            <div>로그인 후 이용가능하다</div>
        )
    } else {
        return (
            <div className="flex-1 flex overflow-hidden"
                 onMouseMove={onDrag}
                 onMouseUp={stopDragging} onMouseLeave={stopDragging}>

                {/* 사이드 바 */}
                <div className="fixed flex h-screen bg-neutral-50 z-10"
                     style={{width: `${sidebarWidth}px`}}>

                    <MemoSideBar sidebarOpen={sidebarOpen}/>

                    {/* 사이드 바 열기/닫기 버튼 */}
                    <div className="flex">
                        <div className="absolute top-0 -right-10 flex mx-1 select-none" onClick={openSidebarHandler}>
                            <div
                                className="flex justify-center items-center bg-neutral-400 bg-opacity-80 px-1 mt-1 h-7 rounded-sm text-white hover:text-neutral-700 cursor-pointer">
                                {sidebarOpen ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"/>
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"/>
                                    </svg>
                                }
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
                <div className="flex-1 flex" style={{marginLeft: `${sidebarWidth}px`}}>
                    <MemoCreatePage/>
                    {children}
                </div>
            </div>
        )
    }
}

export default MemoLayout;