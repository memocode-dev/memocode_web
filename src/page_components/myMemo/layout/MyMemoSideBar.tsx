import {useEffect, useState} from "react";
import {MdOutlineRoofing} from "react-icons/md";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle";
import Avatar from "react-avatar";
import {useKeycloak} from "@/context/KeycloakContext";
import {useRouter} from "next/navigation";
import MyMemoCreateButton from "@/page_components/myMemo/layout/MyMemoCreateButton";
import MyMemoSearchButton from "@/page_components/myMemo/layout/MyMemoSearchButton";
import MyBookedMemos from "@/page_components/myMemo/layout/MyBookedMemos";
import MyPublicMemos from "@/page_components/myMemo/layout/MyPublicMemos";
import MyMemoTabButtons from "@/page_components/myMemo/layout/MyMemoTabButtons";
import MyPrivateMemos from "@/page_components/myMemo/layout/MyPrivateMemos";
import MySecurityMemos from "@/page_components/myMemo/layout/MySecurityMemos";

interface MyMemoSideBarProps {
    sidebarOpen: boolean;
}

const MyMemoSideBar = ({sidebarOpen}: MyMemoSideBarProps) => {

    const router = useRouter()
    const {user_info} = useKeycloak()
    const [isTab, setIsTab] = useState<string>(() => {
        return localStorage.getItem('currentTab') || 'tab1';
    });

    useEffect(() => {
        localStorage.setItem('currentTab', isTab);
    }, [isTab]);

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
                                        typeof window !== 'undefined' && router.push('/')
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
                            round="3px"/>
                        <div className="text-sm">{user_info.first_name + user_info.last_name}님 환영합니다.</div>
                    </div>

                    {/* 내 블로그 */}
                    {/*<MemoWritePageLayout__MyBlogButton/>*/}

                    {/* 검색 */}
                    <MyMemoSearchButton/>

                    {/* 카테고리 관리 */}
                    {/*<MemoWritePageLayout__MemoCategoryManagementButton/>*/}

                    {/* 시리즈 관리 */}
                    {/*<MemoWritePageLayout__MemoSeriesManagementButton/>*/}

                    {/* 새 메모 */}
                    <MyMemoCreateButton/>
                </div>

                {/* 탭 버튼 */}
                <MyMemoTabButtons setIsTab={setIsTab} isTab={isTab}/>

                {/* tab1 - 공개 메모 리스트 */}
                <MyPublicMemos isTab={isTab}/>

                {/* tab2 - 비공개 메모 리스트 */}
                <MyPrivateMemos isTab={isTab}/>

                {/* tab3 - 즐겨찾는 메모 리스트 */}
                <MyBookedMemos isTab={isTab}/>

                {/* tab4 - 보안 메모 리스트 */}
                <MySecurityMemos isTab={isTab}/>
            </div>
        </div>
    );
};

export default MyMemoSideBar;