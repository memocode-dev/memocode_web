'use client'

import {PageResponseSearchQuestionQuestionResult} from "@/openapi/model";
import {useSearchQuestionByKeywordInfinite} from "@/openapi/api/questions/questions";
import {useContext, useEffect, useRef} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {FiSearch} from "react-icons/fi";
import {Button} from "@/components/ui/button";
import {Bounce, toast} from "react-toastify";
import {GiHand} from "react-icons/gi";
import {Badge} from "@/components/ui/badge";
import timeSince from "@/components/utils/timeSince";
import DOMPurify from "dompurify";
import {useTheme} from "@/context/ThemeContext";
import {useKeycloak} from "@/context/KeycloakContext";
import {useRouter} from "next/navigation";
import QuestionSearchModal from "@/page_components/questions/QuestionSearchModal";
import QuestionsSideBar from "@/page_components/questions/QuestionsSideBar";

interface QuestionsPageProps {
    searchAllQuestions: PageResponseSearchQuestionQuestionResult;
}

const QuestionsPage = ({searchAllQuestions}: QuestionsPageProps) => {

    const {openModal} = useContext(ModalContext)
    const {theme} = useTheme()
    const {isLogined} = useKeycloak()
    const router = useRouter()

    const {
        data: searchQuestions,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSearchQuestionByKeywordInfinite({pageSize: 10},
        {
            query: {
                queryKey: [QuestionsPage, searchAllQuestions],
                getNextPageParam: (nextPages) => {
                    if (!nextPages.last) { // 이후에 불러올 질문이 없다면 // nextPages.last => 이후에 불러올 질문이 없으면 false, 있으면 true
                        return nextPages.page! + 1; // nextPages.page_components => 첫번째 16개(page_components:0) / 두번째 16개(page_components:1) / 세번째 16개(page_components:2)
                    }
                },
                initialData: {
                    pages: [searchAllQuestions],
                    pageParams: [],
                },
            },
        }
    );

    const pageContents = searchQuestions?.pages.map((page) => page.content);

    const observer = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // 스크롤 끝까지 가면 다음페이지 불러오기
    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (loadMoreRef.current) {
            observer.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const QuestionSearchButton = (
        <div className="flex justify-center">
            <div
                className="flex w-full sm:w-2/3 p-2 space-x-2 bg-transparent border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-900
                rounded my-5 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transform transition duration-300"
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

    const QuestionCreateButton = (
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

                router.push("/questions/ask")
            }}
            className="flex items-center w-fit h-fit px-2 py-1 rounded space-x-1">
            <div className="text-xs sm:text-sm font-semibold">질문하기</div>
            <GiHand className="w-4 h-4 sm:w-5 sm:h-5"/>
        </Button>
    )

    return (
        <>
            <div
                className="flex flex-1 flex-col py-20 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">
                <QuestionsSideBar/>

                {/* 검색 버튼 */}
                {QuestionSearchButton}

                <div className="flex justify-end items-center mt-5">
                    {/* 질문하기 버튼 */}
                    {QuestionCreateButton}
                </div>

                <div className="bg-background flex flex-1 flex-col pb-20">

                    {/* Q&A 목록 */}
                    <div className="flex flex-1 flex-col justify-start bg-transparent">
                        {pageContents?.map((questions) => (
                            questions?.map((question, index) => {
                                return (
                                    <div
                                        onClick={() => {
                                            router.push(`/questions/${question.id}`)
                                        }}
                                        key={index}
                                        className="flex flex-col w-full bg-transparent mt-5 p-2 sm:p-4 border border-gray-200 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer transform transition duration-300">

                                        <div className="flex flex-col">
                                            <div
                                                className="text-md sm:text-xl font-semibold line-clamp-1">{question.formattedQuestion && question.formattedQuestion.title}</div>
                                            <div className="text-sm line-clamp-2">
                                                <div className="markdown-body"
                                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(question.formattedQuestion && question.formattedQuestion.content || "")}}></div>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <div className="hidden sm:flex">
                                                {question?.tags?.map((tag: string, index: number) => (
                                                    tag.length <= 9 &&
                                                    <Badge key={index}
                                                           className="text-sm mx-1 my-0.5 rounded">{tag}</Badge>
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

                        <div ref={loadMoreRef} className="flex my-2 justify-center items-center">
                            {isFetchingNextPage ? '불러오는 중...' : hasNextPage}
                        </div>
                    </div>
                </div>
            </div>

            <QuestionSearchModal/>
        </>
    )
}

export default QuestionsPage;