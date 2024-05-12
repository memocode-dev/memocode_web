import {Button} from "@/components/ui/button.tsx";
import {MdExpandMore} from "react-icons/md";
import {Badge} from "@/components/ui/badge.tsx";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import timeSince from "@/components/utils/timeSince.tsx";
import {useNavigate} from "react-router-dom";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {useSearchQuestionInfinite} from "@/openapi/api/questions/questions.ts";

const QuestionsPage = () => {

    const navigate = useNavigate()

    const {
        data: questionsDatas,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSearchQuestionInfinite({}, {
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

    const QuestionsPage__QuestionsMoreButton = hasNextPage && (
        <Button
            className="flex-1 bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200"
            onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? '불러오는 중' : <MdExpandMore className="w-7 h-7"/>}
        </Button>
    )

    return (
        <>
            <div className="bg-background flex flex-1 flex-col py-7">

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
                                            {question?.tags?.map((tag: string, index) => {
                                                return (
                                                    <>
                                                        {tag.length <= 9 &&
                                                            <Badge
                                                                key={index}
                                                                className="mt-3 text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1">{tag}</Badge>
                                                        }
                                                    </>
                                                );
                                            })}
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex text-xs space-x-2">
                                                <div>{question?.user?.username}</div>
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

            <div className="flex my-2">
                {QuestionsPage__QuestionsMoreButton}
            </div>
        </>
    )
}

export default QuestionsPage