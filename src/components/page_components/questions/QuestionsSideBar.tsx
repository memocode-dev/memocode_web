'use client'

import {Bounce, toast} from "react-toastify";
import {MdQuestionAnswer} from "react-icons/md";
import {GiHand} from "react-icons/gi";
import {useTheme} from "@/context/ThemeContext";
import {useParams, usePathname, useRouter} from "next/navigation";
import {useKeycloak} from "@/context/KeycloakContext";
import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";

const QuestionsSideBar = () => {

    const {openModal} = useContext(ModalContext)
    const {theme} = useTheme()
    const {isLogined} = useKeycloak()
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams<{ questionId: string }>();
    const questionId = params?.questionId || '';

    const [selectedMenu, setSelectedMenu] = useState<string>()

    const handleNavigate = (path: string) => {
        typeof window !== 'undefined' && router.push(path);
        setSelectedMenu(path);
    }

    useEffect(() => {
        if (pathname) {
            setSelectedMenu(pathname)
        }
    }, [pathname]);

    const QuestionsSidebarListButton = (
        <div
            onClick={() => {
                if (pathname === "/questions/ask") {
                    return openModal({
                        name: ModalTypes.QUESTION_CREATE_CANCEL
                    })
                }

                handleNavigate("/questions")
            }}
            className={`flex flex-1
                    items-center space-x-2 py-1 px-2 cursor-pointer border-l-2
                    ${selectedMenu === "/questions" || selectedMenu === `/questions/${questionId}` ? `border-l-primary text-primary` : `border-l-gray-400 text-gray-400`}
                    transition-all duration-500 ease-in-out`}>
            <MdQuestionAnswer className="w-4 h-4"/>

            <div
                className={`${selectedMenu === "/questions" || selectedMenu === `/questions/${questionId}` ? `text-primary` : `text-gray-500 dark:text-gray-400`} transition-all duration-500 ease-in-out text-sm font-semibold`}>Q&A
                둘러보기
            </div>
        </div>
    )

    const QuestionsSidebarCreateQuestionButton = (
        <div
            onClick={() => {
                if (!isLogined) {
                    toast.warn("로그인 후 이용 가능합니다.", {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                    });
                    return;
                }

                handleNavigate("/questions/ask")

            }}
            className={`flex flex-1
                    items-center space-x-2 py-1 px-2 cursor-pointer border-l-2
                    ${selectedMenu === "/questions/ask" ? `border-l-primary text-primary` : `border-l-gray-400 text-gray-400`}
                    transition-all duration-500 ease-in-out`}>
            <GiHand className="w-4 h-4"/>

            <div
                className={`${selectedMenu === "/questions/ask" ? `text-primary` : `text-gray-500 dark:text-gray-400`} transition-all duration-500 ease-in-out text-sm font-semibold`}>
                질문하기
            </div>
        </div>
    )

    return (
        <div
            className="hidden md:flex flex-1 flex-col fixed top-[100px] left-[20px] xl:left-[60px] 2xl:left-[200px]">
            <div className="bg-transparent w-[180px] lg:w-[200px] xl:w-[220px]">

                {/* Q&A 둘러보기 버튼 */}
                {QuestionsSidebarListButton}

                {/* 질문하기 버튼 */}
                {QuestionsSidebarCreateQuestionButton}

            </div>
        </div>
    )
}

export default QuestionsSideBar;