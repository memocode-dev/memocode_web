import {useState} from "react";
import SearchModal from "@/components/memos/sidebar/SearchModal.tsx";
import CategoryModal from "@/components/memos/sidebar/CategoryModal.tsx";
import CreateBlogModal from "@/components/memos/sidebar/CreateBlogModal.tsx";
import ProfileCard from "@/components/memos/sidebar/ProfileCard.tsx";

interface memoSideBarProps {
    sidebarOpen: boolean;
}

const MemoSideBar = ({sidebarOpen}: memoSideBarProps) => {

    const [isTab, setIsTab] = useState<string>("tab1");

    return (
        <div className={`w-full h-full ${sidebarOpen ? "" : "hidden"}`}>
            <div className="flex flex-col p-2 space-y-4 h-full">

                {/* 프로필 카드 */}
                <ProfileCard/>

                {/* 사이드바 목록 */}
                <div className="flex flex-col space-y-1">

                    {/* 블로그 활성화 */}
                    <CreateBlogModal/>

                    {/* 검색 */}
                    <SearchModal/>

                    {/* 카테고리 관리 */}
                    <CategoryModal/>

                    <div
                        className="select-none cursor-pointer"
                        onClick={() => {
                            console.log("새 메모")
                        }}>
                        <div
                            className="bg-transparent hover:bg-gray-200 rounded-sm py-1 px-2">
                            <div className="text-sm cursor-pointer tracking-wider">새 메모</div>
                        </div>
                    </div>
                </div>

                {/* 메모 리스트 탭 */}
                <div className="flex w-full">
                    {/* tab1 - 전체 버튼 */}
                    <label
                        htmlFor="tab1"
                        className={`flex-1 flex rounded-sm py-1 px-2 bg-transparent select-none ${isTab === "tab1" ? `text-indigo-600` : `hover:bg-gray-200`}`}>
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
                           className={`flex-1 flex rounded-sm py-1 px-2 bg-transparent select-none ${isTab === "tab2" ? `text-indigo-600` : `hover:bg-gray-200`}`}>
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

                {/* tab1 - 전체 */}
                <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab1" ? "" : `hidden`}`}>
                    <div className="flex flex-col bg-white dark:bg-neutral-800 space-y-4 flex-1 py-1">
                        <div
                            className={`flex dark:text-neutral-200 flex-col`}
                            id="tab1">
                            <button
                                onClick={() => {
                                    console.log("새 메모 시작하기")
                                }}
                                className="mx-2 my-1 text-left hover:bg-gray-100 pl-1 py-2"
                            >
                                새 메모 시작하기
                            </button>
                        </div>
                    </div>
                </div>

                {/* tab2 - 카테고리 */}
                <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab2" ? "" : `hidden`}`}>
                    <div className="flex flex-col bg-white dark:bg-neutral-800 space-y-2 flex-1 py-1">
                        <div
                            className={`flex dark:text-neutral-200 flex-col`}
                            id="tab2">

                            <CategoryModal/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoSideBar;
