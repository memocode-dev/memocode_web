import {useNavigate, useParams} from "react-router-dom";
import {useFindQuestion} from "@/openapi/api/questions/questions.ts";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {Controller, useForm} from "react-hook-form";
import {Badge} from "@/components/ui/badge.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {IoIosMore} from "react-icons/io";
import {RiDeleteBin6Line, RiEditLine} from "react-icons/ri";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import mermaid from "mermaid";
import QuestionPage__QuestionComments from "@/page_components/question_page/QuestionPage__QuestionComments.tsx";
import QuestionPage__QuestionDeleteModal from "@/page_components/question_page/QuestionPage__QuestionDeleteModal.tsx";
import {Bounce, toast} from "react-toastify";
import {
    useCreateQuestionComment,
    useFindAllQuestionComment
} from "@/openapi/api/questions-comments/questions-comments.ts";
import {CreateQuestionCommentForm} from "@/openapi/model";
import Avatar from "react-avatar";
import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import ResizeHandle from "@/components/utils/resizeHandle.tsx";

const QuestionPage = () => {

    const {questionId} = useParams()
    const {user_info} = useKeycloak()
    const {theme} = useContext(ThemeContext);
    const {openModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const [height, setHeight] = useState(250);

    const createQuestionCommentForm = useForm<CreateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    })

    const {data: question} = useFindQuestion(questionId!, {
        query: {
            queryKey: ['QuestionPage', questionId!],
        }
    });

    const {
        data: comments,
        refetch: questionCommentsRefetch
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionPage__QuestionComments', questionId]
        }
    });

    const {mutate: createQuestionComment} = useCreateQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답변이 등록되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                createQuestionCommentForm.reset()
                await questionCommentsRefetch();
            },
            onError: (error) => {
                console.log(error)
                const response = error?.response?.status;
                const errorMsg1 = "로그인 이후 이용가능합니다."
                const errorMsg2 = "관리자에게 문의하세요"
                toast.error(() => {
                    if (response === 401) {
                        return errorMsg1;
                    } else {
                        return errorMsg2;
                    }}, {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
            }
        }
    })

    const handleCreateQuestionCommentSubmit = (data: CreateQuestionCommentForm) => {

        if (!data.content) {
            toast.warn("내용을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
            });
            return
        }

        if (data.content) {
            onQuestionCommentCreateSubmit(data)
        }
    }

    const onQuestionCommentCreateSubmit = (data: CreateQuestionCommentForm) => createQuestionComment({
        questionId: questionId!,
        data: data,
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

    const QuestionPage__Profile = (
        <>
            <div className="flex items-center space-x-1.5 cursor-pointer">
                <Avatar
                    name={question?.user?.username}
                    size="25"
                    round="5px"/>
                <div className="tracking-wider">{question?.user?.username}</div>
            </div>

            <div>
                <div className="text-gray-500 dark:text-gray-300 tracking-wider">
                    {question && question?.createdAt && new Date(question.createdAt).toLocaleDateString('ko-KR').slice(0, -1)}
                </div>
            </div>
        </>
    )

    const QuestionPage__Content = (
        <>
            <div className="bg-transparent cursor-default">
                <div className="border-b border-b-gray-400 dark:border-b-gray-500 pt-2 pb-10">
                    {question && user_info?.username === question.user?.username &&
                        <div
                            className="flex justify-end">
                            <Menubar className="border-none hover:bg-secondary cursor-pointer">
                                <MenubarMenu>
                                    <MenubarTrigger
                                        className="group inline-flex px-1.5 h-fit w-fit items-center justify-center rounded-md text-sm font-medium cursor-pointer">
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

                    <div className="text-lg font-medium leading-snug break-all pt-10">
                        <div className="markdown-body"
                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(question && question.content || ""))}}></div>
                    </div>
                </div>
            </div>

            <QuestionPage__QuestionDeleteModal/>
        </>
    )

    const QuestionPage__CreateComment = (
        <div className="flex flex-1 flex-col bg-background py-10">
            <form onSubmit={createQuestionCommentForm.handleSubmit(handleCreateQuestionCommentSubmit)}
                  className="flex flex-1 flex-col">
                <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300 cursor-default">
                    {comments?.reduce((total, comment) => total + (comment.childQuestionComments ? comment.childQuestionComments.length : 0), comments.length)}개의
                    답변
                </div>

                <div
                    className="resize-container pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative"
                    style={{height}}
                >
                    <Controller
                        control={createQuestionCommentForm.control}
                        name="content"
                        render={({field: {onChange, value}}) => (
                            <CustomMonacoEditor
                                key={questionId}
                                width={`${100}%`}
                                height={`${100}%`}
                                language="markdown"
                                theme={theme === "light" ? "vs" : "vs-dark"}
                                onChange={onChange}
                                value={value}
                                className="question_comment_css relative"
                            />
                        )}
                    />
                    <ResizeHandle
                        onResize={(height) => {
                            setHeight(height);
                        }}
                    />
                </div>

                <div className="flex flex-1 justify-end">
                    <Button
                        type="submit"
                        className="flex w-16 h-12 bg-primary hover:bg-primary-hover rounded p-2 justify-center items-center mt-5">
                        <div>등록</div>
                    </Button>
                </div>
            </form>
        </div>
    )

    return (
        <div className="flex flex-1 mt-16 py-10 mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[200px] 2xl:mx-[400px]">
            <div
                className="flex flex-1 flex-col xl:h-screen px-5 md:px-14">
                <div className="flex-1 w-full">
                    <div className="bg-background border-b border-b-gray-400 pb-3">
                        <div className="text-2xl sm:text-[30px] font-bold leading-snug break-all">
                            {question?.title}
                        </div>

                        <div className="flex flex-wrap py-4 cursor-default">
                            {question?.tags?.map((tag: string, index) => {
                                return (
                                    <div key={index}>
                                        <Badge
                                            className="text-md text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mx-1 my-1">{tag}</Badge>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between items-center">
                            {QuestionPage__Profile}
                        </div>
                    </div>

                    {QuestionPage__Content}

                    {QuestionPage__CreateComment}

                    <QuestionPage__QuestionComments comments={comments!}/>
                </div>
            </div>

            {/*/!* 질문유저정보 *!/*/}
            {/*<QuestionPage__QuestionUserInfo question={question}/>*/}

            <UpToDownButton direction="up"/>
        </div>
    )
}

export default QuestionPage