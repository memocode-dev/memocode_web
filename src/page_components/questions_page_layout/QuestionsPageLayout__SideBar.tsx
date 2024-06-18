import {MdQuestionAnswer} from "react-icons/md";
import {useLocation, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {GiHand} from "react-icons/gi";
import {Bounce, toast} from "react-toastify";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const QuestionsPageLayout__SideBar = () => {

    const navigate = useNavigate()
    const {isLogined} = useKeycloak();
    const {pathname} = useLocation()
    const [selectedMenu, setSelectedMenu] = useState<string>()
    const {theme} = useContext(ThemeContext)

    const handleNavigate = (path: string) => {
        navigate(path);
        setSelectedMenu(path);
    }

    useEffect(() => {
        if (pathname) {
            setSelectedMenu(pathname)
        }
    }, [pathname]);

    const QuestionsPageLayout__Sidebar__QuestionListButton = (
        <div
            onClick={() => handleNavigate("/questions")}
            className={`flex flex-1
                    items-center space-x-2 py-1 px-2 cursor-pointer border-l-2
                    ${selectedMenu === "/questions" ? `border-l-primary text-primary` : `border-l-gray-400 text-gray-400`}
                    transition-all duration-500 ease-in-out`}>
            <MdQuestionAnswer className="w-4 h-4"/>

            <div className={`${selectedMenu === "/questions" ? `text-primary` : `text-gray-500 dark:text-gray-400`} transition-all duration-500 ease-in-out text-sm font-semibold`}>Q&A 모아보기</div>
        </div>
    )

    const QuestionsPageLayout__Sidebar__CreateQuestionButton = (
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

                {/* Q&A 모아보기 버튼 */}
                {QuestionsPageLayout__Sidebar__QuestionListButton}

                {/* 질문하기 버튼 */}
                {QuestionsPageLayout__Sidebar__CreateQuestionButton}

            </div>
        </div>
    )
}

export default QuestionsPageLayout__SideBar