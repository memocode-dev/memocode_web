import {useState} from "react";
import {MdOutlineRoofing} from "react-icons/md";
import ThemeToggle from "@/components/theme/ThemeToggle.tsx";
import {useNavigate} from "react-router-dom";
import MemoSearchButton from "@/components/memos/sidebar/button/MemoSearchButton.tsx";
import MemoCategoryButton from "@/components/memos/sidebar/button/MemoCategoryButton.tsx";
import MemoCreateButton from "@/components/memos/sidebar/button/MemoCreateButton.tsx";
import Memos from "@/components/memos/sidebar/Memos.tsx";
import Categorys from "@/components/memos/sidebar/Categorys.tsx";

interface memoSideBarProps {
    sidebarOpen: boolean;
}

const MemoSideBar = ({sidebarOpen}: memoSideBarProps) => {

    const [isTab, setIsTab] = useState<string>("tab1");
    const navigate = useNavigate()

    return (
        <div className={`w-full h-full ${sidebarOpen ? "" : "hidden"}`}>
            <div className="flex flex-col px-2 py-1 h-full">

                {/* 홈, 테마 변경 */}
                <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                        <div
                            className="cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 p-1 rounded"
                            onClick={() => {
                                navigate('/')
                            }}
                        >
                            <MdOutlineRoofing className="text-gray-800 dark:text-gray-300 w-6 h-6"/>
                        </div>
                    </div>

                    <div className="flex items-center p-1">
                        <ThemeToggle/>
                    </div>
                </div>

                {/* 사이드바 목록 */}
                <div className="flex flex-col space-y-1">

                    {/* 검색 */}
                    <MemoSearchButton/>

                    {/* 카테고리 관리 */}
                    <MemoCategoryButton/>

                    {/* 새 메모 */}
                    <MemoCreateButton/>

                </div>

                {/* 메모 리스트 탭 버튼 */}
                <div className="flex w-full my-1">
                    {/* tab1 - 전체 버튼 */}
                    <label
                        htmlFor="tab1"
                        className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab1" ? `text-white bg-indigo-400 dark:bg-indigo-600` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
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
                           className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab2" ? `text-white bg-indigo-400 dark:bg-indigo-600` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
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
                <Memos isTab={isTab}/>

                {/* tab2 - 카테고리 리스트 */}
                <Categorys isTab={isTab}/>

            </div>
        </div>
    );
};

export default MemoSideBar;
