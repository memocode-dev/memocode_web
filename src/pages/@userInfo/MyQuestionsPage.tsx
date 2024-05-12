import {faker} from "@faker-js/faker";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";

const MyQuestionsPage = () => {

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
    }));

    const MyQuestionsPage__QuestionsSortButton = (
        <div defaultValue={sort} className="cursor-pointer">
            <div className="flex space-x-2">
                <div
                    className={`rounded py-1 px-3 text-sm
                                 ${sort === "recent" || pathname === `/@${user_info.username}/questions` ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/@${user_info.username}/questions/recent`);
                        setSort("recent");
                    }}>
                    최신순
                </div>
                <div
                    className={`rounded py-1 px-3 text-sm
                                ${sort === "like" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/@${user_info.username}/questions/like`);
                        setSort("like");
                    }}>
                    좋아요순
                </div>
                <div
                    className={`rounded py-1 px-3 text-sm
                                ${sort === "comment" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/@${user_info.username}/questions/comment`);
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
                            navigate(`/questions/${fakeData.id}`)
                        }}
                        className="flex flex-col w-full bg-transparent mb-5 p-2 sm:p-4 border border-gray-200 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer transform transition duration-300">

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

export default MyQuestionsPage