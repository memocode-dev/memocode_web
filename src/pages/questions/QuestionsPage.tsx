import {Button} from "@/components/ui/button.tsx";
import {MdExpandMore} from "react-icons/md";
import {Badge} from "@/components/ui/badge.tsx";
import timeSince from "@/components/utils/timeSince.tsx";
import {useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";
import {useSearchQuestionByKeywordInfinite} from "@/openapi/api/questions/questions.ts";
import {Bounce, toast} from "react-toastify";
import {GiHand} from "react-icons/gi";
import {useContext} from "react";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import QuestionsPage__QuestionSearchModal
    from "@/page_components/questions_page/QuestionsPage__QuestionSearchModal.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {FiSearch} from "react-icons/fi";

const QuestionsPage = () => {

    const navigate = useNavigate()
    const {isLogined} = useKeycloak()
    const {openModal} = useContext(ModalContext)
    const {theme} = useContext(ThemeContext);

    const {
        data: questionsDatas,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSearchQuestionByKeywordInfinite({}, {
        query: {
            queryKey: ['QuestionsPage'],
            getNextPageParam: (lastPage) => {
                if (!lastPage.last) {
                    return lastPage.page! + 1;
                }
            },
        }
    });

    const questionsData = questionsDatas?.pages.map(page => page.content)

    const QuestionsPage__QuestionSearchButton = (
        <div className="flex justify-center">
            <div
                className="flex w-full sm:w-2/3 p-2 space-x-2 bg-transparent border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-900
                rounded my-3 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transform transition duration-300"
                onClick={() => {
                    openModal({
                        name: ModalTypes.QUESTION_SEARCH,
                    })
                }}>
                <FiSearch className="w-5 h-5"/>
                <span className="text-sm">질문을 검색해보세요!</span>
            </div>
        </div>
    )

    const QuestionsPage__QuestionCreateButton = (
        <Button
            onClick={() => {
                if (!isLogined) {
                    toast.warn("로그인 후 이용 가능합니다.", {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                    });
                    return;
                }

                navigate("/questions/ask")
            }}
            className="flex items-center w-fit h-fit px-2 py-1 rounded space-x-1">
            <div className="text-xs sm:text-sm font-semibold">질문하기</div>
            <GiHand className="w-4 h-4 sm:w-5 sm:h-5"/>
        </Button>
    )

    const QuestionsPage__QuestionsMoreButton = hasNextPage && (
        <Button
            className="flex-1 bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200"
            onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? '불러오는 중' : <MdExpandMore className="w-7 h-7"/>}
        </Button>
    )

    return (
        <>
            {/* 검색 버튼 */}
            {QuestionsPage__QuestionSearchButton}

            <div className="flex justify-end items-center mt-5">
                {/* 질문하기 버튼 */}
                {QuestionsPage__QuestionCreateButton}
            </div>

            <div className="bg-background flex flex-1 flex-col pb-20 md:pb-0">

                {/* Q&A 목록 */}
                <div className="flex flex-1 flex-col justify-start bg-transparent">
                    {questionsData?.map((questions) => (
                        questions?.map((question, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        navigate(`/questions/${question.id}`)
                                    }}
                                    key={index}
                                    className="flex flex-col w-full bg-transparent mt-5 p-2 sm:p-4 border border-gray-200 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer transform transition duration-300">

                                    <div className="flex flex-col">
                                        <div
                                            className="text-md sm:text-lg font-semibold line-clamp-1">{question.formattedQuestion && question.formattedQuestion.title}</div>
                                        <div className="text-sm line-clamp-2">
                                            <div className="markdown-body"
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(question.formattedQuestion && question.formattedQuestion.content || "")}}></div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="hidden sm:flex">
                                            {question?.tags?.map((tag: string, index) => (
                                                tag.length <= 9 &&
                                                <Badge key={index} className="mt-3 mr-1">{tag}</Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center mt-3">
                                            <div className="flex text-xs space-x-2">
                                                <div>{question?.user?.username}</div>
                                                <div
                                                    className="text-gray-500 dark:text-gray-400">
                                                    {question.createdAt && timeSince(new Date(question.createdAt))}
                                                </div>
                                            </div>

                                            {/*<div className="flex text-xs space-x-1">*/}
                                            {/*    <div*/}
                                            {/*        className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">*/}
                                            {/*        <AiFillLike className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>*/}
                                            {/*        <span>미</span>*/}
                                            {/*    </div>*/}
                                            {/*    <div className="text-gray-400">|</div>*/}
                                            {/*    <div*/}
                                            {/*        className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">*/}
                                            {/*        <IoGlasses className="w-4 h-4 sm:w-5 sm:h-5"/>*/}
                                            {/*        <span>구</span>*/}
                                            {/*    </div>*/}
                                            {/*    <div className="text-gray-400">|</div>*/}
                                            {/*    <div*/}
                                            {/*        className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">*/}
                                            {/*        <AiOutlineComment className="w-3 h-3 sm:w-4 sm:h-4"/>*/}
                                            {/*        <span>현</span>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ))}
                </div>
            </div>

            <div className="flex my-2">
                {QuestionsPage__QuestionsMoreButton}
            </div>

            <QuestionsPage__QuestionSearchModal/>
        </>
    )
}

export default QuestionsPage