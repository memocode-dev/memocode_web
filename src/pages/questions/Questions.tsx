import {MdQuestionAnswer} from "react-icons/md";
import {FaQ} from "react-icons/fa6";
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";

const Questions = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();

    // 현재 선택된 메뉴의 상태를 관리합니다.
    const [selectedMenu, setSelectedMenu] = useState(pathname);

    // 메뉴 아이템 클릭 시 이동하고 선택된 메뉴 상태를 업데이트합니다.
    const handleNavigate = (path: string) => {
        navigate(path);
        setSelectedMenu(path);
    }

    return (
        <div
            className="flex flex-1 mt-[65px] bg-white dark:bg-[#1E1E1E] overflow-y-auto mx-5 sm:mx-[50px] md:mx-[50px] lg:mx-[100px] xl:mx-[150px] 2xl:mx-[200px]">
            <div
                className="flex-1 fixed left-5 p-3 flex flex-col rounded bg-gray-100 shadow-lg xl:w-[190px] 2xl:w-[240px]">
                {/* 메뉴 아이템들 */}
                <div
                    onClick={() => handleNavigate("/questions")}
                    className={`flex items-center space-x-1 pl-2 py-1 pr-1 cursor-pointer
                    ${selectedMenu === "/questions" ? `border-l-4 border-indigo-500` : `border-l-4 border-transparent`}
                    transition-all duration-300 ease-in-out`}>
                    <MdQuestionAnswer className="w-5 h-5"/>
                    <div className="text-gray-800">QnA 모아보기</div>
                </div>

                <div
                    onClick={() => handleNavigate("/questions/ask")}
                    className={`flex items-center space-x-1 pl-2 py-1 pr-1 cursor-pointer
                    ${selectedMenu === "/questions/ask" ? `border-l-4 border-indigo-500` : `border-l-4 border-transparent`}
                    transition-all duration-300 ease-in-out`}>
                    <FaQ className="w-5 h-5"/>
                    <div className="text-gray-800">질문하러가기</div>
                </div>
            </div>
        </div>
    )
}

export default Questions