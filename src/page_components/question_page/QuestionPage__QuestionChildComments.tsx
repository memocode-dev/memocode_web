import Avatar from "react-avatar";
import timeSince from "@/components/utils/timeSince.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {Controller, useForm} from "react-hook-form";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    CreateQuestionCommentForm, FindAllMemoCommentMemoCommentResult,
    FindAllQuestionCommentQuestionCommentResult, UpdateQuestionCommentForm
} from "@/openapi/model";
import {toast} from "react-toastify";
import {
    useCreateChildQuestionComment,
    useFindAllQuestionComment, useUpdateQuestionComment
} from "@/openapi/api/questions-comments/questions-comments.ts";
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useParams} from "react-router-dom";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";

interface QuestionPageProps {
    comment: FindAllQuestionCommentQuestionCommentResult;
    showComments: { [key: string]: boolean };
    handleCommentIdForCreateQuestionChildComment: string;
    setHandleCommentIdForCreateQuestionChildComment: (questionChildCommentId: string) => void;
}

const QuestionPage__QuestionChildComments = ({
                                                 comment,
                                                 showComments,
                                                 handleCommentIdForCreateQuestionChildComment,
                                                 setHandleCommentIdForCreateQuestionChildComment
                                             }: QuestionPageProps) => {

    const {theme} = useContext(ThemeContext)
    const {questionId} = useParams()
    const {user_info} = useKeycloak()
    const {openModal} = useContext(ModalContext)

    const [handleQuestionChildCommentIdForUpdateQuestionChildComment, setHandleQuestionChildCommentIdForUpdateQuestionChildComment] = useState("")

    const createQuestionChildCommentForm = useForm<CreateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    })

    const updateQuestionChildCommentForm = useForm<UpdateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    })

    // 댓즐 전체 조회
    const {
        refetch: questionCommentsRefetch
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionPage__QuestionComments', questionId]
        }
    });

    // 대댓글 생성
    const {mutate: createQuestionChildComment} = useCreateChildQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답글이 생성되었습니다.")
                setHandleCommentIdForCreateQuestionChildComment("")
                await questionCommentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    // 대댓글 수정
    const {mutate: updateQuestionChildComment} = useUpdateQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답글이 수정되었습니다.")
                setHandleQuestionChildCommentIdForUpdateQuestionChildComment("")
                await questionCommentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    // 대댓글 생성
    const onCreateQuestionChildCommentSubmit = (questionCommentId: string, data: CreateQuestionCommentForm) => createQuestionChildComment({
        questionId: questionId!,
        questionCommentId: questionCommentId,
        data: data,
    });

    // 대댓글 수정
    const onUpdateQuestionChildCommentSubmit = (questionChildCommentId: string, data: UpdateQuestionCommentForm) => updateQuestionChildComment({
        questionId: questionId!,
        questionCommentId: questionChildCommentId,
        data: data,
    });

    const handleCreateQuestionChildCommentSubmit = (commentId: string) => (data: CreateQuestionCommentForm) => {

        if (!data.content) {
            toast.warn("내용을 입력하세요.")
            return
        }

        if (data.content) {
            onCreateQuestionChildCommentSubmit(commentId, data)
        }
    }

    const handleUpdateQuestionChildCommentSubmit = (questionChildCommentId: string) => (data: UpdateQuestionCommentForm) => {

        if (!data.content) {
            toast.warn("내용을 입력하세요.")
            return
        }

        if (data.content) {
            onUpdateQuestionChildCommentSubmit(questionChildCommentId, data)
        }
    }

    // questionChildComment의 content가 배열값으로 나와서 string으로 변환
    const questionChildComment = comment.childQuestionComments?.map((childComment) => (childComment.content))
    const convertToStringContent = questionChildComment?.filter(Boolean).join('');

    useEffect(() => {
        if (comment) {
            updateQuestionChildCommentForm.reset(
                {
                    content: convertToStringContent
                }
            )
        }
    }, [comment]);

    const QuestionsPage__QuestionsChildComments__WritterProfile = (childQuestionComment: FindAllQuestionCommentQuestionCommentResult) => (
        <>
            <div
                className="flex items-center space-x-1 cursor-default">
                <Avatar
                    className="w-6 h-6 rounded"
                    name={childQuestionComment.user?.username}
                    size="25"
                    round="5px"/>

                <div
                    className="text-sm sm:text-md racking-wider">{childQuestionComment.user?.username}</div>
            </div>

            <div
                className="text-xs text-gray-500 dark:text-gray-300">
                {timeSince(new Date(childQuestionComment.createdAt!))}
            </div>
        </>
    )

    const QuestionsPage__QuestionsChildComments__QuestionChildCommentEditButtons = (childComment: FindAllMemoCommentMemoCommentResult) => (
        <>
            <Button
                onClick={() => {
                    setHandleQuestionChildCommentIdForUpdateQuestionChildComment(childComment.id!)
                }}
                variant="link"
                className="w-fit h-fit px-2 py-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
                수정
            </Button>

            <Button
                onClick={() => {
                    openModal({
                        name: ModalTypes.QUESTION_COMMENT_DELETE,
                        data: {
                            questionId: questionId,
                            questionCommentId: childComment.id
                        }
                    });
                }}
                type="button"
                variant="link"
                className="w-fit h-fit px-0 py-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
                삭제
            </Button>
        </>
    )

    const QuestionPage__QuestionsChildComments__CreateQuestionChildCommentForm = (commentId: string) => {
        return (
            <form
                onSubmit={createQuestionChildCommentForm.handleSubmit(handleCreateQuestionChildCommentSubmit(commentId))}
                className="flex-1 flex flex-col bg-gray-100 dark:bg-neutral-900 px-7 py-7 mt-5">
                <div
                    className="h-[250px] pt-14 pb-5 pl-5 bg-background border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                    <Controller
                        control={createQuestionChildCommentForm.control}
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
                </div>

                <div className="flex space-x-1 justify-end mt-2">
                    <Button
                        type="submit"
                        className="w-fit h-fit px-2.5 py-2 text-sm rounded text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                        저장
                    </Button>

                    <Button
                        onClick={() => {
                            setHandleCommentIdForCreateQuestionChildComment("")
                        }}
                        className="w-fit h-fit px-2.5 py-2 text-sm rounded hover:bg-secondary-hover"
                        type="button"
                        variant="secondary"
                    >
                        닫기
                    </Button>
                </div>
            </form>
        )
    }

    return (
        <>
            {/* 답글 조회 */}
            {comment.childQuestionComments?.length !== 0 && !showComments[comment.id!] &&
                <div
                    className="flex-1 flex flex-col bg-gray-100 dark:bg-neutral-900 px-7 pb-7 mt-5">
                    {comment.childQuestionComments?.map((childQuestionComment) => {
                        return (
                            <div className="pt-7">
                                <div className="flex justify-between mb-5">
                                    <div className="flex items-center space-x-2">

                                        {/* 대댓글쓴이 프로필 */}
                                        {QuestionsPage__QuestionsChildComments__WritterProfile(childQuestionComment)}

                                    </div>

                                    {/* 대댓글 수정 / 삭제 버튼 */}
                                    <div className="flex space-x-0.5">
                                        {!childQuestionComment.deleted && user_info?.id === childQuestionComment.user?.id &&
                                            QuestionsPage__QuestionsChildComments__QuestionChildCommentEditButtons(childQuestionComment)
                                        }
                                    </div>
                                </div>

                                {/* 대댓글 내용 표시 / 수정 폼 */}
                                {handleQuestionChildCommentIdForUpdateQuestionChildComment === childQuestionComment.id ?
                                    <form
                                        onSubmit={updateQuestionChildCommentForm.handleSubmit(handleUpdateQuestionChildCommentSubmit(childQuestionComment.id))}
                                        className="flex-1 flex flex-col bg-gray-100 dark:bg-neutral-900 px-7 py-7 mt-5">
                                        <div
                                            className="h-[250px] pt-14 pb-5 pl-5 bg-background border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                                            <Controller
                                                control={updateQuestionChildCommentForm.control}
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
                                        </div>

                                        <div className="flex space-x-1 justify-end mt-2">
                                            <Button
                                                type="submit"
                                                className="w-fit h-fit px-2.5 py-2 text-sm rounded text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                                            >
                                                저장
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setHandleQuestionChildCommentIdForUpdateQuestionChildComment("")
                                                }}
                                                className="w-fit h-fit px-2.5 py-2 text-sm rounded hover:bg-secondary-hover"
                                                type="button"
                                                variant="secondary"
                                            >
                                                닫기
                                            </Button>
                                        </div>
                                    </form>

                                    // <>
                                    //     <textarea
                                    //         value={updateQuestionChildCommentValue}
                                    //         onChange={(event) => {
                                    //             setUpdateQusetionChildCommentValue(event.target.value)
                                    //         }}
                                    //         className="w-full h-32 resize-none border border-gray-200 dark:border-gray-400 bg-background outline-none rounded p-2 mb-5">
                                    //     </textarea>
                                    //
                                    //     <div className="flex space-x-1 justify-end">
                                    //         <Button
                                    //             onClick={() => {
                                    //                 if (!updateQuestionChildCommentValue) {
                                    //                     toast.warn("내용을 입력하세요.")
                                    //                     return
                                    //                 }
                                    //                 // onUpdateChildCommentSubmit(childComment.id!)
                                    //             }}
                                    //             className="w-fit h-fit px-2 py-1.5 text-xs rounded text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                                    //         >
                                    //             저장
                                    //         </Button>
                                    //
                                    //         <Button
                                    //             onClick={() => {
                                    //                 setUpdateQusetionChildCommentValue("")
                                    //                 setHandleQuestionChildCommentIdForUpdateQuestionChildComment("")
                                    //             }}
                                    //             className="w-fit h-fit px-2 py-1.5 text-xs rounded hover:bg-secondary-hover"
                                    //             type="button"
                                    //             variant="secondary"
                                    //         >
                                    //             닫기
                                    //         </Button>
                                    //     </div>
                                    // </>
                                    :
                                    <div className="font-medium leading-snug break-all mt-2">
                                        <div className="markdown-body"
                                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(childQuestionComment && childQuestionComment.content || ""))}}></div>
                                    </div>
                                }

                                {/*<div className="font-medium leading-snug break-all mt-2">*/}
                                {/*    <div className="markdown-body"*/}
                                {/*         dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(childQuestionComment && childQuestionComment.content || ""))}}></div>*/}
                                {/*</div>*/}
                            </div>
                        )
                    })}

                </div>
            }

            {/* 답글 등록 폼 */}
            {handleCommentIdForCreateQuestionChildComment === comment.id &&
                QuestionPage__QuestionsChildComments__CreateQuestionChildCommentForm(comment.id)
            }
        </>
    )
}

export default QuestionPage__QuestionChildComments;