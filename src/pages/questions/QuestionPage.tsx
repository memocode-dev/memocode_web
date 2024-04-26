import {useNavigate, useParams} from "react-router-dom";
import {useFindQuestion} from "@/openapi/api/questions/questions.ts";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useForm} from "react-hook-form";
import {Badge} from "@/components/ui/badge.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {IoIosMore} from "react-icons/io";
import {RiDeleteBin6Line, RiEditLine} from "react-icons/ri";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import mermaid from "mermaid";
import QuestionPage__QuestionAnswer from "@/page_components/question_page/QuestionPage__QuestionAnswer.tsx";
import QuestionPage__QuestionDeleteModal from "@/page_components/question_page/QuestionPage__QuestionDeleteModal.tsx";

const QuestionPage = () => {

    const {questionId} = useParams()
    const {user_info} = useKeycloak()
    const {theme} = useContext(ThemeContext);
    const {openModal} = useContext(ModalContext)
    const navigate = useNavigate()

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

    const {setValue, watch} = useForm({
        defaultValues: {
            answer: ""
        }
    })

    const {data: question} = useFindQuestion(questionId!, {
        query: {
            queryKey: ['QuestionPage', questionId!],
        }
    });

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [question, theme]);

    const QuestionPage__Title = (
        <div className="bg-background py-5 cursor-default">
            <div className="text-2xl font-bold leading-snug break-all">
                {question && question.title}
            </div>

            <div className="flex justify-between items-center border-b border-b-gray-300 pt-5 pb-2">
                <div className="text-sm tracking-wider">{question && question.user?.username}</div>

                <div className="text-sm stext-gray-500 dark:text-gray-300 tracking-wider">
                    {question && question?.createdAt
                        ? new Date(question?.createdAt).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).replace(/-/g, '.')
                        : ''}
                </div>
            </div>
        </div>
    )

    const QuestionPage__Content = (
        <>
            <div className="bg-background cursor-default">
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

                <div className="border-b border-b-gray-300 py-5 my-14 space-y-10">
                    <div className="text-lg font-medium leading-snug break-all">
                        <div className="markdown-body"
                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(question && question.content || ""))}}></div>
                    </div>

                    {question && user_info?.username === question.user?.username &&
                        <div
                            className="flex justify-end">
                            <Menubar className="border-none hover:bg-secondary cursor-pointer">
                                <MenubarMenu>
                                    <MenubarTrigger
                                        className="group inline-flex px-1 h-fit w-fit items-center justify-center rounded-md text-sm font-medium cursor-pointer">
                                        <IoIosMore className="w-5 h-5"/>
                                    </MenubarTrigger>

                                    <MenubarContent className="min-w-[7px] dark:bg-neutral-700 border-none">
                                        {/* 수정 */}
                                        <MenubarItem className="p-0 dark:hover:bg-black">
                                            <Button
                                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                                onClick={() => {
                                                    navigate(`/questions/edit/${question.id}`)
                                                }}
                                            >
                                                <RiEditLine className="w-[18px] h-[18px]"/>
                                                <div className="ml-1 text-sm pr-1">수정</div>
                                            </Button>
                                        </MenubarItem>

                                        {/* 삭제 */}
                                        <MenubarItem className="p-0 dark:hover:bg-black">
                                            <Button
                                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                                onClick={() => {
                                                    openModal({
                                                        name: ModalTypes.QUESTION_DELETE
                                                    });
                                                }}
                                                type="button"
                                            >
                                                <RiDeleteBin6Line className="w-[18px] h-[18px]"/>
                                                <div className="ml-1 text-sm pr-1">삭제</div>
                                            </Button>
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                    }

                </div>

                <div className="flex justify-center space-x-2">
                    <div onClick={handleLike} className="cursor-pointer">
                        {!like && <AiOutlineLike className="animate-bounce text-gray-500 dark:text-gray-400 w-9 h-9"/>}
                        {like && <AiFillLike className="text-indigo-500 w-9 h-9"/>}
                    </div>

                    <div
                        className="flex justify-center items-center bg-gray-200 dark:bg-neutral-700 w-9 h-9 rounded-full">
                        <span>{count}</span>

                    </div>
                </div>
            </div>

            <QuestionPage__QuestionDeleteModal/>
        </>
    )

    const QuestionPage__Comment = (
        <div className="flex flex-1 bg-background py-10">
            <div className="flex-1">
                <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300 cursor-default">답변하기</div>

                <div className="flex-1">
                    <div
                        className="h-[450px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                        <CustomMonacoEditor
                            key={questionId}
                            width={`${100}%`}
                            height={`${100}%`}
                            language="markdown"
                            theme={theme === "light" ? "vs" : "vs-dark"}
                            onChange={(value) => setValue("answer", value)}
                            value={watch("answer")}
                            className="question_comment_css relative"
                        />
                    </div>
                </div>

                <div className="flex flex-1 justify-end">
                    <Button
                        className="flex w-16 h-12 bg-primary hover:bg-primary-hover rounded p-2 justify-center items-center mt-2">
                        <div>등록</div>
                    </Button>
                </div>
            </div>
        </div>
    )

    return (
        <div
            className="flex flex-1 flex-col mt-14 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px] py-3">
            <div className="flex-1 w-full">

                {QuestionPage__Title}

                {QuestionPage__Content}

                {QuestionPage__Comment}

                <QuestionPage__QuestionAnswer/>
            </div>
        </div>
    )
}

export default QuestionPage