import {MdQuestionAnswer} from "react-icons/md";
import {FaQ} from "react-icons/fa6";
import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";

const QuestionsSideBar = () => {

    const {pathname} = useLocation();
    const navigate = useNavigate();
    const [selectedMenu, setSelectedMenu] = useState(pathname);

    const handleNavigate = (path: string) => {
        navigate(path);
        setSelectedMenu(path);
    }

    return (
        <div
            className="hidden lg:flex flex-1 fixed flex-col left-2 mt-3 xl:left-8 p-3 rounded bg-gray-100 dark:bg-black shadow-lg w-[135px] xl:w-[190px] 2xl:w-[340px]">
            <div
                onClick={() => handleNavigate("/questions")}
                className={`flex items-center space-x-2 pl-2 py-1 pr-1 cursor-pointer
                    ${selectedMenu === "/questions" ? `border-l-4 border-indigo-500` : `border-l-4 border-transparent`}
                    transition-all duration-500 ease-in-out`}>
                <MdQuestionAnswer className="w-5 h-5"/>

                <div className="flex xl:hidden text-gray-800 dark:text-gray-200 font-semibold">Q&A</div>
                <div className="hidden xl:flex text-gray-800 dark:text-gray-200 font-semibold">Q&A 모아보기</div>
            </div>

            <div
                onClick={() => handleNavigate("/questions/ask")}
                className={`flex items-center space-x-2 pl-2 py-1 pr-1 cursor-pointer
                    ${selectedMenu === "/questions/ask" ? `border-l-4 border-indigo-500` : `border-l-4 border-transparent`}
                    transition-all duration-500 ease-in-out`}>
                <FaQ className="w-5 h-5"/>

                <div className="flex xl:hidden text-gray-800 dark:text-gray-200 font-semibold">질문 등록</div>
                <div className="hidden xl:flex text-gray-800 dark:text-gray-200 font-semibold">질문 하러가기</div>
            </div>
        </div>
    )
}

export default QuestionsSideBar