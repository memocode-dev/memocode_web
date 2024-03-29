import {useContext, useState} from "react";
import {MdOutlineRoofing} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import MemoSearchButton from "@/components/memos/sidebar/button/MemoSearchButton.tsx";
import MemoCategoryButton from "@/components/memos/sidebar/button/MemoCategoryButton.tsx";
import MemoCreateButton from "@/components/memos/sidebar/button/MemoCreateButton.tsx";
import Memos from "@/components/memos/sidebar/Memos.tsx";
import Bookmarks from "@/components/memos/sidebar/Bookmarks.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import UserContext from "@/context/UserContext.tsx";
import MyBlogButton from "@/components/memos/sidebar/button/MyBlogButton.tsx";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import ThemeToggle from "@/components/theme/ThemeToggle.tsx";

interface memoSideBarProps {
    sidebarOpen: boolean;
}

const MemoSideBar = ({sidebarOpen}: memoSideBarProps) => {

    const [isTab, setIsTab] = useState<string>("tab1");
    const navigate = useNavigate()
    const {user_info} = useContext(UserContext);

    return (
        <div className={`w-full h-full ${sidebarOpen ? "" : "hidden"}`}>
            <div className="flex flex-col px-2 py-1 h-full">

                <div className="flex items-center justify-between">
                    {/* 홈, 테마 변경 */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                    onClick={() => {
                                        navigate('/')
                                    }}
                                >
                                    <MdOutlineRoofing className="text-gray-800 dark:text-gray-300 w-6 h-6"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side={"right"}
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>홈</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="flex items-center p-1">
                        <ThemeToggle/>
                    </div>
                </div>

                {/* 사이드바 목록 */}
                <div className="flex flex-col space-y-1">

                    {/* 프로필 */}
                    <div className="flex items-center space-x-1.5 bg-transparent p-2 cursor-default">
                        <Avatar className="w-5 h-5 rounded">
                            <AvatarImage src="https://github.com/shadcn.png"/>
                            <AvatarFallback>
                                <Skeleton className="h-5 w-5 rounded"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">{user_info && user_info.nickname}님 환영합니다.</div>
                    </div>

                    {/* 내 블로그 */}
                    <MyBlogButton/>

                    {/* 검색 */}
                    <MemoSearchButton/>

                    {/* 카테고리 관리 */}
                    <MemoCategoryButton/>

                    {/* 새 메모 */}
                    <MemoCreateButton/>

                </div>

                {/* 탭 버튼 */}
                <div className="flex w-full my-1">
                    {/* tab1 - 전체 버튼 */}
                    <label
                        htmlFor="tab1"
                        className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab1" ? `bg-primary text-primary-foreground` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
                        <button
                            onClick={() => {
                                setIsTab("tab1")
                            }}
                            className="flex-1 flex justify-center text-sm tracking-wider"
                        >
                            전체
                        </button>
                    </label>

                    {/* tab2 - 즐겨찾기 버튼 */}
                    <label htmlFor="tab2"
                           className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab2" ? `bg-primary text-primary-foreground` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
                        <button
                            onClick={() => {
                                setIsTab("tab2");

                            }}
                            className="flex-1 flex justify-center text-sm tracking-wider"
                        >
                            즐겨찾는 메모
                        </button>
                    </label>
                </div>

                {/* tab1 - 전체 리스트 */}
                <Memos isTab={isTab}/>

                {/* tab2 - 즐겨찾는 메모 리스트 */}
                <Bookmarks isTab={isTab}/>

            </div>
        </div>
    );
};

export default MemoSideBar;
