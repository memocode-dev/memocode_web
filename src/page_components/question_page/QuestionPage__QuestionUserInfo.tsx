import Avatar from "react-avatar";
import {faker} from "@faker-js/faker";
import {IoGlasses} from "react-icons/io5";
import {AiOutlineComment} from "react-icons/ai";
import {Separator} from "@/components/ui/separator.tsx";
import {useNavigate} from "react-router-dom";
import {Badge} from "@/components/ui/badge.tsx";
import {FindQuestionQuestionResult} from "@/openapi/model";
import {useSearchQuestion} from "@/openapi/api/questions/questions.ts";
import {useState} from "react";

interface QuestionUserInfoProps {
    question: FindQuestionQuestionResult | undefined;
}

const QuestionPage__QuestionUserInfo = ({question}: QuestionUserInfoProps) => {

    const navigate = useNavigate();
    const [keyword] = useState<string>("파이썬")

    const searchQuestions =
        useSearchQuestion({
            keyword: keyword,
            page: 0,
            pageSize: 20,
        }, {
            query: {
                queryKey: ["QuestionPage__QuestionUserInfo", keyword]
            }
        })

    const similarQuestions = searchQuestions?.data?.content?.filter((searchQuestion) => (searchQuestion.id !== question?.id))

    // 가짜 데이터 생성
    const fakeData = {
        username: faker.internet.userName().substring(0, 15),
        questionCount: faker.datatype.number({min: 0, max: 5000}),
        answerCount: faker.datatype.number({min: 0, max: 5000}),
        tags: faker.helpers.arrayElements(
            ["JavaScript", "TypeScript", "React", "Node.js", "CSS", "HTML", "Development", "Programming", "Frontend", "Backend", "Web",
                "JavaScript", "TypeScript", "React", "Node.js", "CSS", "HTML", "Development", "Programming", "Frontend", "Backend", "Web"],
            faker.datatype.number({min: 1, max: 20})
        ),
    }

    const QuestionPage__QuestionUserInfo__QuestionUserQnABlogButton = (question: FindQuestionQuestionResult) => {
        return (
            <div
                onClick={() => {
                    navigate(`/@${question?.user?.username}/questions`)
                }}
                className="flex items-center space-x-2 cursor-pointer">
                <Avatar
                    name={question?.user?.username}
                    size="50"
                    round="5px"/>
                <div className="break-words">
                    <div className="text-lg font-bold">{question?.user?.username}</div>
                    <div className="flex text-sm space-x-1">
                        <div className="space-x-0.5">
                            <span>질문 수</span><span>{fakeData.questionCount}</span>
                        </div>

                        <div className="py-1.5">
                            <Separator orientation="vertical"
                                       className="border border-gray-300 dark:border-neutral-500"/>
                        </div>

                        <div className="space-x-0.5">
                            <span>답변 수</span><span>{fakeData.answerCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const QuestionPage__QuestionUserInfo__SimilarQuestions =
        similarQuestions?.map((similarQuestion, index) => {
            return (
                <div key={index} className="space-y-1.5 hover:bg-background rounded-md p-2 cursor-pointer">
                    <span className="line-clamp-2">{similarQuestion.title && similarQuestion.title}</span>

                    <div className="flex items-center justify-between text-xs">

                        <span>{similarQuestion.user && similarQuestion.user.username}</span>

                        <div className="flex justify-end space-x-1">
                            <div className="flex items-center space-x-0.5">
                                <IoGlasses className="w-4 h-4"/>
                                <span>미</span>
                            </div>

                            <div className="flex items-center space-x-0.5">
                                <AiOutlineComment className="w-4 h-4"/>
                                <span>구현</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

    return (
        <div
            className="hidden lg:flex lg:flex-col w-[280px] min-h-screen bg-secondary ml-7 rounded-md p-4 space-y-7 cursor-default">

            {/* 질문 유저 Q&A 블로그 이동 버튼 */}
            {QuestionPage__QuestionUserInfo__QuestionUserQnABlogButton(question!)}

            {/* 관심태그 */}
            <div className="space-y-1">
                <span className="font-semibold">{question?.user?.username}님의 관심태그</span>

                <div className="flex flex-wrap cursor-pointer">
                    {!fakeData.tags &&
                        <span className="text-sm text-gray-500 dark:text-gray-400 ">아직 관심태그가 없어요ㅜㅜ</span>
                    }

                    {fakeData?.tags && fakeData.tags.map((tag, index) => {
                        return (
                            <>
                                <Badge
                                    key={index}
                                    className="text-sm text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mx-1 my-1">{tag}</Badge>
                            </>
                        );
                    })}
                </div>
            </div>

            {/* 비슷항 질문리스트 */}
            <div className="space-y-2">
                <span className="font-semibold">이 질문과 비슷한 질문</span>
                <div className="flex flex-col text-sm space-y-1">
                    {QuestionPage__QuestionUserInfo__SimilarQuestions}
                </div>
            </div>
        </div>
    )
}

export default QuestionPage__QuestionUserInfo;