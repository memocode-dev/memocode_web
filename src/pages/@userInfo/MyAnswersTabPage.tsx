import {faker} from "@faker-js/faker";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {AiFillLike} from "react-icons/ai";
import {useNavigate} from "react-router-dom";
import timeSince from "@/components/utils/timeSince.tsx";

const MyAnswersTabPage = () => {

    const navigate = useNavigate()

    // 가짜 데이터 생성
    const fakeDataArray = Array.from({length: 10}, () => ({
        questionId: faker.datatype.uuid(),
        username: faker.internet.userName().substring(0, 15),
        questionTitle: faker.lorem.paragraphs(),
        myAnswerContent: faker.lorem.paragraphs(),
        createdAt: "2024-05-10T11:35:14.889911Z",
        tags: faker.helpers.arrayElements(
            ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "HTML", "Development", "Programming", "Frontend", "Backend", "Web",
                "JavaScript", "TypeScript", "React", "Node.js", "CSS", "HTML", "Development", "Programming", "Frontend", "Backend", "Web"],
            faker.datatype.number({min: 1, max: 20})
        ),
    }));

    return (
        <div>
            {fakeDataArray.map((fakeData, index) => {
                return (
                    <div
                        key={index}
                        onClick={() => {
                            navigate(`/questions/${fakeData.questionId}`)
                        }}
                        className="flex flex-col w-full bg-transparent mt-5 p-2 sm:p-4 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer transform transition duration-300">

                        {/* 답변 */}
                        <div className="space-y-0.5 mb-2">
                            <span className="text-md font-semibold">답변</span>

                            <div className="text-md line-clamp-2">
                                <div className="markdown-body"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(fakeData.myAnswerContent || ""))}}></div>
                            </div>
                        </div>

                        {/* 질문 */}
                        <div className="space-y-0.5 mb-1">
                            <span className="text-sm font-semibold">질문</span>

                            <div
                                className="text-sm line-clamp-1">{fakeData.questionTitle}
                            </div>
                        </div>

                        {/* 날짜, 좋아요 수 */}
                        <div className="flex items-center justify-between">
                            <div
                                className="flex text-xs text-gray-500 dark:text-gray-400">
                                {fakeData.createdAt && timeSince(new Date(fakeData.createdAt))}
                            </div>

                            <div
                                className="flex text-xs items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                <AiFillLike className="w-3 h-3 sm:w-3.5 sm:h-3.5"/>
                                <span>4</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MyAnswersTabPage;