import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {faker} from "@faker-js/faker";
import {useState} from "react";

const QuestionAnswer = () => {

    const [like, setLike] = useState(false)
    const [count, setCount] = useState(0)

    // 가짜 데이터 생성
    const fakerData = {
        author: faker.person.fullName(),
        totalAnswerCount: faker.datatype.number(100),
        comment: faker.lorem.sentences(faker.datatype.number({min: 5, max: 20})).slice(0, 500),
        tags: faker.helpers.shuffle(['java', 'c++', 'javascript', 'typescript', 'react', 'node.js', 'html', 'css', 'python', 'ruby']).slice(0, faker.datatype.number({
            min: 1,
            max: 9
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
        <div className="bg-background p-5 cursor-default">
            <div className="text-md font-bold leading-snug break-all">
                답변 {fakerData.totalAnswerCount}
            </div>

            {fakerData.tags.map((fake) => {
                return (
                    <div className="flex flex-col border-b border-b-gray-300 px-5 py-5 h-fit space-y-5">
                        <div className="flex items-start sm:items-center">
                            <div className="flex flex-col space-y-1 sm:flex-row sm:space-x-1 sm:items-center">
                                <div className="flex space-x-1">
                                    <Avatar className="h-5 w-5 rounded">
                                        <AvatarImage src="https://github.com/shadcn.png"/>
                                        <AvatarFallback>
                                            <Skeleton className="h-5 w-5 rounded"/>
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="text-sm sm:text-md racking-wider">{fakerData.author}</div>
                                </div>

                                <div className="text-xs text-gray-500 dark:text-gray-300 tracking-wider">
                                    2023.03.18
                                </div>
                            </div>

                            <div className="flex flex-1 justify-end space-x-1">
                                <div onClick={handleLike} className="cursor-pointer">
                                    {!like && <AiOutlineLike className="text-gray-500 dark:text-gray-400 w-6 h-6"/>}
                                    {like && <AiFillLike className="text-indigo-500 w-6 h-6"/>}
                                </div>

                                <div
                                    className="flex justify-center items-center bg-gray-200 dark:bg-neutral-700 w-7 h-7 rounded-full">
                                    <span className="text-sm">{count}</span>
                                </div>
                            </div>
                        </div>

                        <div className="">{fakerData.comment}{fake}</div>
                    </div>
                )
            })}

        </div>
    )
}

export default QuestionAnswer