import {AiOutlineDislike, AiOutlineLike} from "react-icons/ai";
import {Badge} from "@/components/ui/badge.tsx";
import {faker} from "@faker-js/faker";

const QuestionContent = () => {

    // 가짜 데이터 생성
    const fakerData = {
        content: faker.lorem.paragraph(),
        tags: faker.helpers.shuffle(['java', 'c++', 'javascript', 'typescript', 'react', 'node.js', 'html', 'css', 'python', 'ruby']).slice(0, faker.datatype.number({
            min: 1,
            max: 9
        })),
    };


    return (
        <div className="bg-white dark:bg-[#1E1E1E] px-5 pt-10">
            <div className="text-lg font-medium leading-snug break-all">
                {fakerData.content}
            </div>

            <div className="flex justify-between pt-12">
                <div>
                    {fakerData.tags.map((tag: string) => {
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

                <div className="flex space-x-2">
                    <AiOutlineLike className="text-gray-500 dark:text-gray-300 w-9 h-9"/>
                    <div className="flex bg-gray-200 dark:bg-neutral-700 px-3 py-1 rounded-full items-center">
                        <span>0</span></div>
                    <AiOutlineDislike className="text-gray-500 dark:text-gray-300 w-9 h-9"/>
                </div>
            </div>
        </div>
    )
}

export default QuestionContent
