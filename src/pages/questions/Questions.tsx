import {GiHand} from "react-icons/gi";
import {Button} from "@/components/ui/button.tsx";
import {useFindAllQuestionInfinite} from "@/openapi/question/api/questions/questions.ts";
import {MdExpandMore} from "react-icons/md";
import {Badge} from "@/components/ui/badge.tsx";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import timeSince from "@/components/utils/timeSince.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import QuestionSearchButton from "@/components/questions/button/QuestionSearchButton.tsx";
import {toast} from "react-toastify";
import {useContext, useState} from "react";
import userContext from "@/context/UserContext.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";

const Questions = () => {

    const {authority, user_info} = useContext(userContext)
    const navigate = useNavigate()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const sortValue = queryParams.get('sort')
    const [selectedMenu, setSelectedMenu] = useState(sortValue)

    const {
        data: questionsDatas,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFindAllQuestionInfinite({
        pageable: {}
    }, {
        query: {
            queryKey: ['Questions'],
            getNextPageParam: (lastPage) => {
                if (!lastPage.last) {
                    return lastPage.number! + 1;
                }
            },
        }
    });

    const questionsData = questionsDatas?.pages.map(page => page.content)

    return (
        <>
            <div className="bg-background flex flex-1 flex-col py-7">

                {/* 검색 */}
                <QuestionSearchButton/>

                <div className="flex justify-between items-center mt-5">
                    {/* 탭 버튼 */}
                    <div defaultValue={sortValue!} className="cursor-pointer">
                        <div className="flex space-x-2">
                            <div
                                className={`rounded py-1 px-3 transition-all duration-500 ease-in-out text-sm
                                 ${selectedMenu === "recent" || !sortValue ? `bg-gray-200 text-black` : `bg-gray-100 text-gray-500`}`}
                                onClick={() => {
                                    navigate(`/questions?sort=recent`);
                                    setSelectedMenu("recent");
                                }}>
                                최신순
                            </div>
                            <div
                                className={`rounded py-1 px-3 transition-all duration-500 ease-in-out text-sm
                                ${selectedMenu === "like" ? `bg-gray-200 text-black` : `bg-gray-100 text-gray-500`}`}
                                onClick={() => {
                                    navigate(`/questions?sort=like`);
                                    setSelectedMenu("like");
                                }}>
                                좋아요순
                            </div>
                            <div
                                className={`rounded py-1 px-3 transition-all duration-500 ease-in-out text-sm
                                ${selectedMenu === "comment" ? `bg-gray-200 text-black` : `bg-gray-100 text-gray-500`}`}
                                onClick={() => {
                                    navigate(`/questions?sort=comment`);
                                    setSelectedMenu("comment");
                                }}>
                                답변많은순
                            </div>
                        </div>
                    </div>

                    {/* 질문하기 */}
                    <Button
                        onClick={() => {
                            if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                                toast.warn("로그인 후 이용 가능합니다.");
                                return;
                            }

                            if (user_info) {
                                navigate("/questions/ask")
                            }
                        }}
                        className="flex items-center w-fit h-fit px-2 py-1.5 rounded bg-primary hover:bg-primary-hover space-x-1">
                        <div className="text-xs sm:text-sm font-semibold">질문하기</div>
                        <GiHand className="w-4 h-4 sm:w-5 sm:h-5"/>
                    </Button>
                </div>

                {/* Q&A 목록 */}
                <div className="flex flex-1 flex-col justify-start bg-transparent pt-3 pb-10">
                    {questionsData?.map((questions) => (
                        questions?.map((question, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        navigate(`/questions/${question.id}`)
                                    }}
                                    key={index}
                                    className="flex flex-col w-full bg-transparent p-2 sm:p-4 border-b border-b-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer transform transition duration-300">

                                    <div className="flex flex-col">
                                        <div
                                            className="text-md sm:text-lg font-semibold line-clamp-1">{question?.title}</div>
                                        <div className="text-sm line-clamp-2">
                                            <div className="markdown-body"
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(question?.content || ""))}}></div>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="hidden sm:flex">
                                            {question?.tags?.map((tag: string) => {
                                                return (
                                                    <>
                                                        {tag.length <= 9 &&
                                                            <Badge
                                                                className="mt-3 text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1">{tag}</Badge>
                                                        }
                                                    </>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex text-xs space-x-2">
                                                <div>{question?.author?.username || question?.author?.nickname}</div>
                                                <div
                                                    className="text-gray-500 dark:text-gray-400">
                                                    {question.createdAt && timeSince(new Date(question.createdAt))}
                                                </div>
                                            </div>

                                            <div className="flex text-xs space-x-1">
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <AiFillLike className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>
                                                    <span>미</span>
                                                </div>
                                                <div className="text-gray-400">|</div>
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <IoGlasses className="w-4 h-4 sm:w-5 sm:h-5"/>
                                                    <span>구</span>
                                                </div>
                                                <div className="text-gray-400">|</div>
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <AiOutlineComment className="w-3 h-3 sm:w-4 sm:h-4"/>
                                                    <span>현</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ))}
                </div>
            </div>

            {hasNextPage && (
                <div className="flex my-2">
                    <Button
                        className="flex-1 bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200"
                        onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? '불러오는 중' : <MdExpandMore className="w-7 h-7"/>}
                    </Button>
                </div>
            )}
        </>
    )
}

export default Questions