import {faker} from "@faker-js/faker";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

const MyQuestionsTabPage = () => {

    const navigate = useNavigate()

    // 가짜 데이터 생성
    const fakeDataArray = Array.from({length: 10}, () => ({
        id: faker.datatype.uuid(),
        username: faker.internet.userName().substring(0, 15),
        title: faker.lorem.paragraphs(),
        content: faker.lorem.paragraph(),
        createdAt: "2024-05-10T11:35:14.889911Z",
        tags: faker.helpers.arrayElements(
            ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "HTML", "Development", "Programming", "Frontend", "Backend", "Web",
                "JavaScript", "TypeScript", "React", "Node.js", "CSS", "HTML", "Development", "Programming", "Frontend", "Backend", "Web"],
            faker.datatype.number({min: 1, max: 20})
        ),
    }))

    return (
        <div>
            {fakeDataArray.map((fakeData, index) => {
                return (
                    <div
                        key={index}
                        onClick={() => {
                            navigate(`/questions/${fakeData.id}`)
                        }}
                        className="flex flex-col w-full bg-transparent mt-5 p-2 sm:p-4 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer transform transition duration-300">

                        <div className="flex flex-col">
                            <div
                                className="text-md sm:text-lg font-semibold line-clamp-1">{fakeData.title}
                            </div>
                            <div className="text-sm line-clamp-2">
                                <div className="markdown-body"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(fakeData.content || ""))}}></div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="hidden sm:flex sm:flex-wrap">
                                {fakeData?.tags?.map((tag: string, index) => {
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

                            <div className="flex items-center justify-between mt-3">
                                <div
                                    className="flex text-xs text-gray-500 dark:text-gray-400">
                                    {fakeData.createdAt && fakeData?.createdAt && new Date(fakeData.createdAt).toLocaleDateString('ko-KR').slice(0, -1)}
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
            })}
        </div>
    )
}

export default MyQuestionsTabPage;