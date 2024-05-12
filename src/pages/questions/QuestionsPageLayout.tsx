import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {Outlet} from "react-router-dom";
import QuestionsPageLayout__SideBar from "@/page_components/questions_page_layout/QuestionsPageLayout__SideBar.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {CiSearch} from "react-icons/ci";
import QuestionsPage__QuestionSearchModal
    from "@/page_components/questions_page/QuestionsPage__QuestionSearchModal.tsx";
import {useContext} from "react";

const QuestionsPageLayout = () => {

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

    return (
        <div
            className="flex flex-1 flex-col mt-20 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">

            {/* 사이드 바 */}
            <QuestionsPageLayout__SideBar/>


            {/* 검색 버튼 */}
            {QuestionsPage__QuestionSearchButton}

            <Outlet/>

            {/* 위로 이동 버튼 */}
            <UpToDownButton direction="up"/>

            <QuestionsPage__QuestionSearchModal/>
        </div>
    )
}

export default QuestionsPageLayout