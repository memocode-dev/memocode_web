import {GiHand} from "react-icons/gi";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {BiSearch} from "react-icons/bi";
import {useFindAllQuestionInfinite} from "@/openapi/question/api/questions/questions.ts";
import {MdExpandMore} from "react-icons/md";
import {Badge} from "@/components/ui/badge.tsx";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import timeSince from "@/components/utils/timeSince.tsx";
import {useNavigate} from "react-router-dom";

const Questions = () => {

    const navigate = useNavigate();

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
                    return {
                        page: lastPage.number! + 1,
                    };
                }
            },
        }
    });
    console.log("questionsDatas", questionsDatas)

    const questionsData = questionsDatas?.pages.map(page => page.content)

    return (
        <>
            <div className="bg-transparent flex flex-1 flex-col p-3">
                {/* 질문하기 */}
                <div className="flex justify-end">
                    <Button
                        className="flex items-center w-fit h-fit p-2 rounded bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white space-x-1">
                        <div className="text-sm font-semibold">질문하기</div>
                        <GiHand className="w-5 h-5"/>
                    </Button>
                </div>

                {/* 검색 */}
                <div className="flex w-full py-5 items-center space-x-3 relative">
                    <Input type="text"
                           className="text-lg py-6 pl-10 placeholder:text-gray-700 placeholder:dark:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0
                               bg-gray-100 dark:bg-neutral-700 border-0 dark:border-neutral-800 shadow-lg dark:shadow-black/20"
                           placeholder="검색"/>

                    <BiSearch className="absolute w-6 h-6 text-gray-700 dark:text-gray-300"/>
                </div>

                {/* Q&A 목록 */}
                <div className="flex flex-1 flex-col justify-start bg-transparent">
                    {questionsData?.map((questions) => (
                        questions?.map((question, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        navigate(`/questions/${question.questionId}`)
                                    }}
                                    key={index}
                                    className="flex flex-col w-full bg-transparent p-2 sm:p-5 border-b border-b-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer">

                                    <div className="flex flex-col">
                                        <div className="text-lg font-semibold">{question?.title}</div>
                                        <div className="text-sm">{question?.content?.substring(0, 100)}...</div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="hidden sm:flex">
                                            {question?.tags?.tags?.map((tag: string) => {
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

                                            <div className="flex text-xs space-x-1.5">
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <AiFillLike className="w-3.5 h-3.5"/>
                                                    <span>미</span>
                                                </div>
                                                <div className="text-gray-400">|</div>
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <IoGlasses className="w-5 h-5"/>
                                                    <span>구</span>
                                                </div>
                                                <div className="text-gray-400">|</div>
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <AiOutlineComment className="w-4 h-4"/>
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