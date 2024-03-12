import {useContext, useState} from "react";
import SearchModal from "@/components/memos/sidebar/SearchModal.tsx";
import CategoryModal from "@/components/memos/sidebar/CategoryModal.tsx";
import NewMemo from "@/components/memos/sidebar/NewMemo.tsx";
import TotalList from "@/components/memos/sidebar/list/TotalList.tsx";
import CategoryList from "@/components/memos/sidebar/list/CategoryList.tsx";
import {MdOutlineRoofing} from "react-icons/md";
import HandleTheme from "@/components/theme/HandleTheme.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Button} from "@/components/ui/button.tsx";
import UserContext from "@/context/UserContext.tsx";
import {useNavigate} from "react-router-dom";

interface memoSideBarProps {
    sidebarOpen: boolean;
}

const MemoSideBar = ({sidebarOpen}: memoSideBarProps) => {

    const [isTab, setIsTab] = useState<string>("tab1");
    const {logout, user_info} = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <div className={`w-full h-full ${sidebarOpen ? "" : "hidden"}`}>
            <div className="flex flex-col px-2 py-1 h-full">

                {/* 홈, 테마 변경 */}
                <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                        <div
                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-[#2B2B37] p-1 rounded"
                            onClick={() => {
                                navigate('/')
                            }}
                        >
                            <MdOutlineRoofing className="text-gray-800 dark:text-gray-300 w-6 h-6"/>
                        </div>
                    </div>

                    <div className="flex items-center p-1">
                        <HandleTheme/>
                    </div>
                </div>

                {/* 프로필 카드 */}
                <div className="fixed flex justify-between space-x-3 top-2.5 right-3">
                    <div className="flex items-center space-x-2">
                        <Avatar className="hover:animate-headShake w-6 h-6 rounded">
                            <AvatarImage src="https://github.com/shadcn.png"/>
                            <AvatarFallback>
                                <Skeleton className="w-6 h-6 rounded"/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-xs dark:text-gray-300">{user_info.nickname}</div>
                    </div>

                    <div>
                        <Button className="h-7 w-14 text-xs bg-indigo-400 hover:bg-indigo-500 text-white"
                                onClick={() => {
                                    logout();
                                    navigate("/")
                                }}>로그아웃</Button>
                    </div>
                </div>

                {/* 사이드바 목록 */}
                <div className="flex flex-col space-y-1">

                    {/* 검색 */}
                    <SearchModal/>

                    {/* 카테고리 관리 */}
                    <CategoryModal/>

                    {/* 새 메모 */}
                    <NewMemo/>

                </div>

                {/* 메모 리스트 탭 버튼 */}
                <div className="flex w-full mb-1">
                    {/* tab1 - 전체 버튼 */}
                    <label
                        htmlFor="tab1"
                        className={`flex-1 flex rounded-sm py-1 px-2 bg-transparent select-none ${isTab === "tab1" ? `text-indigo-600 dark:text-white` : `text-gray-500 hover:bg-gray-200 dark:hover:bg-[#2B2B37]`}`}>
                        <button
                            onClick={() => {
                                setIsTab("tab1")
                            }}
                            className="flex-1 flex justify-center text-sm tracking-wider"
                        >
                            전체
                        </button>
                    </label>

                    {/* tab2 - 카테고리 버튼 */}
                    <label htmlFor="tab2"
                           className={`flex-1 flex rounded-sm py-1 px-2 bg-transparent select-none ${isTab === "tab2" ? `text-indigo-600 dark:text-white` : `text-gray-500 hover:bg-gray-200 dark:hover:bg-[#2B2B37]`}`}>
                        <button
                            onClick={() => {
                                setIsTab("tab2")
                            }}
                            className="flex-1 flex justify-center text-sm tracking-wider"
                        >
                            카테고리
                        </button>
                    </label>
                </div>

                {/* tab1 - 전체 리스트 */}
                <TotalList isTab={isTab}/>

                {/* tab2 - 카테고리 리스트 */}
                <CategoryList isTab={isTab}/>

            </div>
        </div>
    );
};

export default MemoSideBar;
