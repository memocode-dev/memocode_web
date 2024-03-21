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
            className="hidden md:flex flex-1 fixed flex-col p-3 left-4 xl:left-12 2xl:left-48 rounded-md bg-gray-100 dark:bg-black shadow-lg w-[180px] lg:w-[200px] xl:w-[220px]">
            <div
                onClick={() => handleNavigate("/questions")}
                className={`flex items-center space-x-2 pl-2 py-1 pr-1 cursor-pointer
                    ${selectedMenu === "/questions" ? `border-l-4 border-indigo-500` : `border-l-4 border-transparent`}
                    transition-all duration-500 ease-in-out`}>
                <MdQuestionAnswer className="w-5 h-5"/>

                <div className="flex text-gray-800 dark:text-gray-200 font-semibold">Q&A 모아보기</div>
            </div>

            <div
                onClick={() => handleNavigate("/questions/ask")}
                className={`flex items-center space-x-2 pl-2 py-1 pr-1 cursor-pointer
                    ${selectedMenu === "/questions/ask" ? `border-l-4 border-indigo-500` : `border-l-4 border-transparent`}
                    transition-all duration-500 ease-in-out`}>
                <FaQ className="w-5 h-5"/>

                <div className="flex text-gray-800 dark:text-gray-200 font-semibold">질문 하러가기</div>
            </div>
        </div>
    )
}

export default QuestionsSideBar