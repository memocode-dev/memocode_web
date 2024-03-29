import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useContext} from "react";
import {CiSearch} from "react-icons/ci";
import QuestionSearch from "@/components/questions/QuestionSearch.tsx";

const QuestionSearchButton = () => {

    const {openModal} = useContext(ModalContext)

    return (
        <div className="flex justify-center">
            <div
                className="flex w-full sm:w-2/3 p-2 space-x-2 bg-transparent border border-gray-300 dark:border-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-900
                rounded my-3 cursor-pointer text-gray-400 hover:text-gray-700 transform transition duration-300"
                onClick={() => {
                    openModal({
                        name: ModalTypes.QUESTION_SEARCH,
                    })
                }}>
                <CiSearch className="w-5 h-5"/>
                <span className="text-sm">검색어를 입력하세요.</span>
            </div>

            <QuestionSearch/>
        </div>
    )
}

export default QuestionSearchButton