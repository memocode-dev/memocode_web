import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {Badge} from "@/components/ui/badge.tsx";
import {useState} from "react";
import {QuestionDetailDto} from "@/openapi/question/model";

const QuestionContent = ({question}: { question: QuestionDetailDto }) => {

    const [like, setLike] = useState(false)
    const [count, setCount] = useState(0)

    const handleLike = () => {
        setLike(prev => !prev)

        if (like) {
            setCount(count - 1)
        } else {
            setCount(count + 1)
        }
    }

    return (
        <div className="bg-background space-y-14 cursor-default">
            <div className="flex flex-wrap">
                {question && question.tags?.map((tag) => {
                    return (
                        <>
                            <Badge
                                className="text-md text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mx-1 my-1">{tag}</Badge>
                        </>
                    );
                })}
            </div>

            <div className="text-lg font-medium leading-snug break-all">
                {question && question.content}
            </div>

            <div className="flex justify-center space-x-2">
                <div onClick={handleLike} className="cursor-pointer">
                    {!like && <AiOutlineLike className="animate-bounce text-gray-500 dark:text-gray-400 w-9 h-9"/>}
                    {like && <AiFillLike className="text-indigo-500 w-9 h-9"/>}
                </div>

                <div className="flex justify-center items-center bg-gray-200 dark:bg-neutral-700 w-9 h-9 rounded-full">
                    <span>{count}</span>

                </div>
            </div>
        </div>
    )
}

export default QuestionContent
