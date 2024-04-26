import {useState} from "react";
import {MdOutlineRoofing} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import ThemeToggle from "@/components/theme/ThemeToggle.tsx";
import Avatar from "react-avatar";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import MemoWritePageLayout__MyBlogButton
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__buttons/MemoWritePageLayout__MyBlogButton.tsx";
import MemoWritePageLayout__MyMemos from "@/page_components/memo_write_page_layout/MemoWritePageLayout__MyMemos.tsx";
import MemoWritePageLayout__MyBookedMemos
    from "@/page_components/memo_write_page_layout/MemoWritePageLayout__MyBookedMemos.tsx";
import MemoWritePageLayout__MemoSearchButton
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__buttons/MemoWritePageLayout__MemoSearchButton.tsx";
import MemoWritePageLayout__MemoCategoryManagementButton
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__buttons/MemoWritePageLayout__MemoCategoryManagementButton.tsx";
import MemoWritePageLayout__MemoSeriesManagementButton
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__buttons/MemoWritePageLayout__MemoSeriesManagementButton.tsx";
import MemoWritePageLayout__MemoCreateButton
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__buttons/MemoWritePageLayout__MemoCreateButton.tsx";
import MemoWritePageLayout__MySecurityMemos
    from "@/page_components/memo_write_page_layout/MemoWritePageLayout__MySecurityMemos.tsx";
import MemoWritePageLayout__MemoTabButtons
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__buttons/MemoWritePageLayout__MemoTabButtons.tsx";

interface memoSideBarProps {
    sidebarOpen: boolean;
}

const MemoWritePageLayout__SideBar = ({sidebarOpen}: memoSideBarProps) => {

    const navigate = useNavigate()
    const {user_info} = useKeycloak()

    const [isTab, setIsTab] = useState<string>("tab1");

    return (
        <div className={`w-full h-full ${sidebarOpen ? "" : "hidden"}`}>
            <div className="flex flex-col px-2 py-1 h-full">

                <div className="flex items-center justify-between">
                    {/* 홈, 테마 변경 */}
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
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
                        <Avatar
                            name={user_info?.username}
                            size="25"
                            round="5px"/>
                        <div className="text-sm">{user_info.first_name + user_info.last_name}님 환영합니다.</div>
                    </div>

                    {/* 내 블로그 */}
                    <MemoWritePageLayout__MyBlogButton/>

                    {/* 검색 */}
                    <MemoWritePageLayout__MemoSearchButton/>

                    {/* 카테고리 관리 */}
                    <MemoWritePageLayout__MemoCategoryManagementButton/>

                    {/* 시리즈 관리 */}
                    <MemoWritePageLayout__MemoSeriesManagementButton/>

                    {/* 새 메모 */}
                    <MemoWritePageLayout__MemoCreateButton/>

                </div>

                {/* 탭 버튼 */}
                <MemoWritePageLayout__MemoTabButtons setIsTab={setIsTab} isTab={isTab}/>

                {/* tab1 - 전체 리스트 */}
                <MemoWritePageLayout__MyMemos isTab={isTab}/>

                {/* tab2 - 즐겨찾는 메모 리스트 */}
                <MemoWritePageLayout__MyBookedMemos isTab={isTab}/>

                {/* tab3 - 보안 메모 리스트 */}
                <MemoWritePageLayout__MySecurityMemos isTab={isTab}/>
            </div>
        </div>
    );
};

export default MemoWritePageLayout__SideBar;