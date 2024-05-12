import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import QuestionsPageLayout__SideBar from "@/page_components/questions_page_layout/QuestionsPageLayout__SideBar.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {CiSearch} from "react-icons/ci";
import QuestionsPage__QuestionSearchModal
    from "@/page_components/questions_page/QuestionsPage__QuestionSearchModal.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "react-toastify";
import {GiHand} from "react-icons/gi";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import {useContext, useState} from "react";

const QuestionsPageLayout = () => {

    const navigate = useNavigate()
    const {isLogined} = useKeycloak()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const sortValue = queryParams.get('sort')
    const [selectedMenu, setSelectedMenu] = useState(sortValue)
    const {openModal} = useContext(ModalContext)

    const QuestionsPage__QuestionSearchButton = (
        <div className="flex justify-center">
            <div
                className="flex w-full sm:w-2/3 p-2 space-x-2 bg-transparent border border-gray-300 dark:border-gray-500 dark:hover:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-900
                rounded my-3 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transform transition duration-300"
                onClick={() => {
                    openModal({
                        name: ModalTypes.QUESTION_SEARCH,
                    })
                }}>
                <CiSearch className="w-5 h-5"/>
                <span className="text-sm">검색어를 입력하세요.</span>
            </div>
        </div>
    )

    const QuestionsPage__QuestionsSortButton = (
        <div defaultValue={sortValue!} className="cursor-pointer">
            <div className="flex space-x-2">
                <div
                    className={`rounded py-1 px-3 text-sm
                                 ${selectedMenu === "recent" || !sortValue ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/questions?sort=recent`);
                        setSelectedMenu("recent");
                    }}>
                    최신순
                </div>
                <div
                    className={`rounded py-1 px-3 text-sm
                                ${selectedMenu === "like" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/questions?sort=like`);
                        setSelectedMenu("like");
                    }}>
                    좋아요순
                </div>
                <div
                    className={`rounded py-1 px-3 text-sm
                                ${selectedMenu === "comment" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/questions?sort=comment`);
                        setSelectedMenu("comment");
                    }}>
                    답변많은순
                </div>
            </div>
        </div>
    )

    const QuestionsPage__QuestionCreateButton = (
        <Button
            onClick={() => {
                if (!isLogined) {
                    toast.warn("로그인 후 이용 가능합니다.");
                    return;
                }

                navigate("/questions/ask")
            }}
            className="flex items-center w-fit h-fit px-2 py-1.5 rounded bg-primary hover:bg-primary-hover space-x-1">
            <div className="text-xs sm:text-sm font-semibold">질문하기</div>
            <GiHand className="w-4 h-4 sm:w-5 sm:h-5"/>
        </Button>
    )

    return (
        <div
            className="flex flex-1 flex-col mt-20 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">

            {/* 사이드 바 */}
            <QuestionsPageLayout__SideBar/>


            {/* 검색 버튼 */}
            {QuestionsPage__QuestionSearchButton}

            <div className="flex justify-between items-center mt-5">
                {/* 정렬 버튼 */}
                {QuestionsPage__QuestionsSortButton}

                {/* 질문하기 버튼 */}
                {QuestionsPage__QuestionCreateButton}
            </div>

            {}
            <Outlet/>

            {/* 위로 이동 버튼 */}
            <UpToDownButton direction="up"/>

            <QuestionsPage__QuestionSearchModal/>
        </div>
    )
}

export default QuestionsPageLayout