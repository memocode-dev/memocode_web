'use client'

import {CreateQuestionCommentForm, FindQuestionQuestionResult} from "@/openapi/model";
import {useKeycloak} from "@/context/KeycloakContext";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar";
import {IoIosMore} from "react-icons/io";
import {Button} from "@/components/ui/button";
import {RiDeleteBin6Line, RiEditLine} from "react-icons/ri";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import timeSince from "@/components/utils/timeSince";
import Avatar from "react-avatar";
import ResizeHandle from "@/components/utils/resizeHandle";
import {Controller, useForm} from "react-hook-form";
import {useContext, useEffect, useRef, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useTheme} from "@/context/ThemeContext";
import {Bounce, toast} from "react-toastify";
import MarkdownView from "@/components/ui/MarkdownView";
import mermaid from "mermaid";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor";
import QuestionComments from "@/page_components/question/QuestionComments";
import QuestionDeleteModal from "@/page_components/question/QuestionDeleteModal";
import CustomMonacoEditorPreview from "@/components/common/CustomMonacoEditorPreview";
import QuestionsSideBar from "@/page_components/questions/QuestionsSideBar";
import {useCreateQuestionComment, useFindAllQuestionComment, useFindQuestion} from "@/openapi/api/questions/questions";
import 'katex/dist/katex.min.css';
import renderMathInElement from "katex/contrib/auto-render";

interface QuestionPageProps {
    searchQuestion: FindQuestionQuestionResult;
}

const QuestionPage = ({searchQuestion}: QuestionPageProps) => {

    const {user_info} = useKeycloak()
    const {openModal} = useContext(ModalContext)
    const params = useParams<{ questionId: string }>();
    const questionId = params?.questionId || '';
    const router = useRouter()
    const {theme} = useTheme()
    const [height, setHeight] = useState<number>(250);
    const contentRef = useRef<HTMLDivElement>(null);

    const {data: question} = useFindQuestion(questionId!, {
        query: {
            queryKey: ['QuestionPage', questionId, searchQuestion],
            initialData: searchQuestion
        }
    });

    const {
        data: comments,
        refetch: questionCommentsRefetch
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionComments', questionId]
        }
    });

    const {mutate: createQuestionComment} = useCreateQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답변이 등록되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
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
                    }
                }, {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            }
        }
    })

    const createQuestionCommentForm = useForm<CreateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    })

    const handleCreateQuestionCommentSubmit = (data: CreateQuestionCommentForm) => {

        if (!data.content) {
            toast.warn("내용을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
                className: "text-sm",
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

    // 마크다운 + 수식 기호 HTML로 변환
    useEffect(() => {
        if (question) {
            if (contentRef.current) {
                // marked를 사용해 마크다운을 HTML로 변환
                const sanitizedHtml = MarkdownView.render(question.content!);
                contentRef.current.innerHTML = sanitizedHtml;

                // KaTeX로 수식 렌더링
                renderMathInElement(contentRef.current, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                    ],
                });
            }
        }
    }, [question]);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [question, theme]);

    const QuestionContent = (
        <>
            <div className="bg-transparent cursor-default">
                <div className="border-b border-b-gray-400 dark:border-b-gray-500 pt-2">
                    {question && user_info?.username === question.user?.username &&
                        <div
                            className="flex justify-end">
                            <Menubar className="border-none hover:bg-secondary cursor-pointer">
                                <MenubarMenu>
                                    <MenubarTrigger
                                        className="group inline-flex px-1.5 h-fit w-fit items-center justify-center rounded-md text-sm font-medium cursor-pointer">
                                        <IoIosMore className="w-5 h-5"/>
                                    </MenubarTrigger>

                                    <MenubarContent sideOffset={10} align="end"
                                                    className="min-w-[7px] dark:bg-neutral-700 border-none">
                                        {/* 수정 */}
                                        <MenubarItem className="p-0 dark:hover:bg-black">
                                            <Button
                                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                                onClick={() => {
                                                    typeof window !== 'undefined' && router.push(`/questions/edit/${question.id}`)
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
                                                        name: ModalTypes.QUESTION_DELETE,
                                                        data: {
                                                            questionId: questionId
                                                        }
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

                    <div className="text-lg font-medium leading-snug break-all py-14">
                        <div ref={contentRef} className="markdown-body w-full"></div>
                    </div>

                    <div className="flex flex-wrap py-4 cursor-default">
                        {question?.tags?.map((tag: string, index) => {
                            return (
                                <div key={index}>
                                    <Badge
                                        className="text-sm mx-1 my-0.5 rounded">{tag}</Badge>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    )

    const QuestionCreateComment = (
        <div className="flex flex-1 flex-col bg-background py-10">
            <form onSubmit={createQuestionCommentForm.handleSubmit(handleCreateQuestionCommentSubmit)}
                  className="flex flex-1 flex-col">
                <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300 cursor-default">
                    {comments?.reduce((total, comment) => total + (comment.childQuestionComments ? comment.childQuestionComments.length : 0), comments.length)}개의
                    답변
                </div>

                <div
                    className="pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative"
                    style={{height, minHeight: `${250}px`}}
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
                        className="flex w-16 h-12 rounded p-2 justify-center items-center mt-5">
                        <div>저장</div>
                    </Button>
                </div>
            </form>
        </div>
    )

    return (
        <>
            <div
                className="flex flex-1 flex-col py-20 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">
                <QuestionsSideBar/>

                <div
                    className="flex flex-1 flex-col xl:h-screen py-14">
                    <div className="flex-1 w-full">
                        <div className="bg-background border-b border-b-gray-400 pb-3 space-y-2">
                            {/* 제목 */}
                            <div className="text-2xl sm:text-[30px] font-bold leading-snug break-all">
                                {question?.title}
                            </div>

                            <div className="flex items-center justify-between">

                                {/* 프로필 */}
                                <div className="flex items-center space-x-1.5 cursor-pointer">
                                    <Avatar
                                        name={question?.user?.username}
                                        size="20"
                                        round="3px"/>
                                    <div className="tracking-wider text-sm">{question?.user?.username}</div>
                                </div>

                                <div className="flex items-center space-x-5">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="text-sm">질문</div>
                                        <Separator orientation="vertical" className="w-0.5 h-3 bg-primary"/>
                                        <div className="text-sm text-gray-500 dark:text-gray-300 tracking-wider">
                                            {question && question?.createdAt && new Date(question.createdAt).toLocaleDateString('ko-KR').slice(0, -1)}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1.5">
                                        <div className="text-sm">수정</div>
                                        <Separator orientation="vertical" className="w-0.5 h-3 bg-primary"/>
                                        <div className="flex text-sm text-gray-500 dark:text-gray-300">
                                            <div>{question && question.updatedAt && timeSince(new Date(question.updatedAt))}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {QuestionContent}

                        {QuestionCreateComment}

                        <QuestionComments questionId={questionId} comments={comments!}/>
                    </div>
                </div>
            </div>
            {/*/!* 질문유저정보 *!/*/}
            {/*<QuestionPage__QuestionUserInfo question={question}/>*/}

            <CustomMonacoEditorPreview/>
            <QuestionDeleteModal/>
        </>
    )
}

export default QuestionPage;