import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {AiOutlineDislike, AiOutlineLike} from "react-icons/ai";
import {faker} from "@faker-js/faker";

const QuestionAnswer = () => {

    // 가짜 데이터 생성
    const fakerData = {
        author: faker.person.fullName(),
        totalAnswerCount: faker.datatype.number(100),
        comment: faker.lorem.sentence(),
        tags: faker.helpers.shuffle(['java', 'c++', 'javascript', 'typescript', 'react', 'node.js', 'html', 'css', 'python', 'ruby']).slice(0, faker.datatype.number({
            min: 1,
            max: 9
        })),
    };

    return (
        <div className="bg-white dark:bg-[#1E1E1E] p-5">
            <div className="text-md font-bold leading-snug break-all">
                답변 {fakerData.totalAnswerCount}
            </div>

            {fakerData.tags.map((fake) => {
                return (
                    <div className="flex flex-col border-b border-b-gray-300 px-5 py-5">
                        <div className="flex items-center space-x-1">
                            <Avatar className="h-5 w-5 rounded">
                                <AvatarImage src="https://github.com/shadcn.png"/>
                                <AvatarFallback>
                                    <Skeleton className="h-5 w-5 rounded"/>
                                </AvatarFallback>
                            </Avatar>

                            <div className="tracking-wider">{fakerData.author}</div>

                            <div className="text-sm text-gray-500 dark:text-gray-300 tracking-wider">
                                2023.03.18
                            </div>

                            <div className="flex flex-1 justify-end space-x-1">
                                <AiOutlineLike className="text-gray-500 dark:text-gray-300 w-6 h-6"/>
                                <div
                                    className="flex bg-gray-200 dark:bg-neutral-700 px-2.5 py-1 rounded-full items-center">
                                    <span className="text-sm">0</span></div>
                                <AiOutlineDislike className="text-gray-500 dark:text-gray-300 w-6 h-6"/>
                            </div>
                        </div>

                        <div className="py-2">{fakerData.comment}{fake}</div>
                    </div>
                )
            })}

        </div>
    )
}

export default QuestionAnswer