import {MdQuestionAnswer} from "react-icons/md";
import {FaA, FaQ} from "react-icons/fa6";
import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import {GiHand} from "react-icons/gi";
import userContext from "@/context/UserContext.tsx";
import {toast} from "react-toastify";

const QuestionsSideBar = () => {

    const {pathname} = useLocation()
    const navigate = useNavigate()
    const {user_info, authority} = useContext(userContext)
    const [selectedMenu, setSelectedMenu] = useState(pathname)

    const handleNavigate = (path: string) => {
        navigate(path);
        setSelectedMenu(path);
    }

    return (
        <div
            className="hidden md:flex flex-1 flex-col fixed top-[100px] left-[20px] xl:left-[60px] 2xl:left-[200px]">
            <div className="bg-transparent w-[180px] lg:w-[200px] xl:w-[220px]">
                <div
                    onClick={() => handleNavigate("/questions")}
                    className={`flex flex-1 border-l-4
                    items-center space-x-2 py-1 px-2 cursor-pointer
                    ${selectedMenu === "/questions" ? `border-l-indigo-500` : `border-l-gray-300`}
                    transition-all duration-500 ease-in-out`}>
                    <MdQuestionAnswer className="w-4 h-4"/>

                    <div className="text-sm text-gray-800 dark:text-gray-200 font-semibold">Q&A 모아보기</div>
                </div>

                <div
                    onClick={() => {
                        if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                            toast.warn("로그인 후 이용 가능합니다.");
                            return;
                        }

                        if (user_info) {
                            handleNavigate("/questions/ask")
                        }
                    }}
                    className={`flex flex-1 border-l-4
                    items-center space-x-2 py-1 px-2 cursor-pointer
                    ${selectedMenu === "/questions/ask" ? `border-l-indigo-500` : `border-l-gray-300`}
                    transition-all duration-500 ease-in-out`}>
                    <GiHand className="w-4 h-4"/>

                    <div className="flex text-sm text-gray-800 dark:text-gray-200 font-semibold">질문하기</div>
                </div>

                <div
                    onClick={() => {
                        if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                            toast.warn("로그인 후 이용 가능합니다.");
                            return;
                        }

                        if (user_info) {
                            handleNavigate(`/@${user_info?.username}/questions`)
                        }
                    }}
                    className={`flex flex-1 border-l-4
                    items-center space-x-2 py-1 px-2 cursor-pointer
                    ${selectedMenu === `/@${user_info?.username}/questions` ? `border-l-indigo-500` : `border-l-gray-300`}
                    transition-all duration-500 ease-in-out`}>
                    <FaQ className="w-4 h-4"/>

                    <div className="flex text-sm text-gray-800 dark:text-gray-200 font-semibold">내 질문</div>
                </div>

                <div
                    onClick={() => {
                        if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                            toast.warn("로그인 후 이용 가능합니다.");
                            return;
                        }

                        if (user_info) {
                            handleNavigate(`/@${user_info?.username}/answers`)
                        }
                    }}
                    className={`flex flex-1 border-l-4
                    items-center space-x-2 py-1 px-2 cursor-pointer
                    ${selectedMenu === `/@${user_info?.username}/answers` ? `border-l-indigo-500` : `border-l-gray-300`}
                    transition-all duration-500 ease-in-out`}>
                    <FaA className="w-4 h-4"/>

                    <div className="flex text-sm text-gray-800 dark:text-gray-200 font-semibold">내 답변</div>
                </div>
            </div>
        </div>
    )
}

export default QuestionsSideBar