import {faker} from "@faker-js/faker";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import timeSince from "@/components/utils/timeSince.tsx";

const MyAnswersPage = () => {

    const navigate = useNavigate()
    const {user_info} = useKeycloak()

    const {pathname} = useLocation()
    const lastPath = pathname.substring(pathname.lastIndexOf("/") + 1);
    const [sort, setSort] = useState<string>()

    useEffect(() => {
        if (pathname) {
            setSort(lastPath)
        }
    }, [pathname]);

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

    const MyQuestionsPage__QuestionsSortButton = (
        <div defaultValue={sort} className="cursor-pointer">
            <div className="flex space-x-2">
                <div
                    className={`rounded py-1 px-3 text-sm
                                 ${sort === "recent" || pathname === `/@${user_info.username}/answers` ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/@${user_info.username}/answers/recent`);
                        setSort("recent");
                    }}>
                    최신순
                </div>
                <div
                    className={`rounded py-1 px-3 text-sm
                                ${sort === "like" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/@${user_info.username}/answers/like`);
                        setSort("like");
                    }}>
                    좋아요순
                </div>
                <div
                    className={`rounded py-1 px-3 text-sm
                                ${sort === "comment" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/@${user_info.username}/answers/comment`);
                        setSort("comment");
                    }}>
                    답변많은순
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex justify-between items-cente my-5">
                {/* 정렬 버튼 */}
                {MyQuestionsPage__QuestionsSortButton}
            </div>

            {fakeDataArray.map((fakeData, index) => {
                return (
                    <div
                        key={index}
                        onClick={() => {
                            navigate(`/questions/${fakeData.questionId}`)
                        }}
                        className="flex flex-col w-full bg-transparent mb-5 space-y-5 p-2 sm:p-4 border border-gray-200 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer transform transition duration-300">

                        {/* 내 답변 */}
                        <div className="space-y-1">
                            <div className="flex bg-transparent justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <span className="text-md font-semibold">내 답변</span>
                                    <div
                                        className="flex text-xs text-gray-500 dark:text-gray-400">
                                        {fakeData.createdAt && timeSince(new Date(fakeData.createdAt))}
                                    </div>
                                </div>

                                <div className="flex items-center text-xs space-x-1">
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

                            <div className="text-md line-clamp-3">
                                <div className="markdown-body"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(fakeData.myAnswerContent || ""))}}></div>
                            </div>
                        </div>

                        {/* 질문 */}
                        <div className="space-y-1">
                            <span className="text-sm font-semibold">질문</span>
                            <div
                                className="text-sm line-clamp-1">{fakeData.questionTitle}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MyAnswersPage