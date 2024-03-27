import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {faker} from "@faker-js/faker";
import {Badge} from "@/components/ui/badge.tsx";
import {useState} from "react";

const QuestionContent = () => {
    const [like, setLike] = useState(false)
    const [count, setCount] = useState(0)

    // 가짜 데이터 생성
    const fakerData = {
        content: faker.lorem.paragraph(),
        tags: faker.helpers.shuffle(['java', 'c++', 'javascript', 'typescript', 'react', 'node.js', 'html', 'css', 'python', 'ruby']).slice(0, faker.datatype.number({
            min: 1,
            max: 10
        })),
    };

    const handleLike = () => {
        setLike(prev => !prev)

        if (like) {
            setCount(count - 1)
        } else {
            setCount(count + 1)
        }
    }

    return (
        <div className="bg-background px-5 space-y-14">
            <div className="flex px-10">
                {fakerData.tags.map((tag: string) => {
                    return (
                        <>
                            <Badge
                                className="text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1">{tag}</Badge>
                        </>
                    );
                })}
            </div>

            <div className="text-lg font-medium leading-snug break-all">
                {fakerData.content}
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
