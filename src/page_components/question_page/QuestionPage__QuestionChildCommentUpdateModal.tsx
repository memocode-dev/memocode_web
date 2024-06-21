import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Controller, useForm} from "react-hook-form";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {UpdateQuestionCommentForm} from "@/openapi/model";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {
    useFindAllQuestionComment,
    useUpdateQuestionComment
} from "@/openapi/api/questions-comments/questions-comments.ts";
import {Bounce, toast} from "react-toastify";

interface QuestionPage__QuestionChildCommentUpdateModalProps {
    setUpdateQuestionChildCommentId: (id: string) => void;
}

const QuestionPage__QuestionChildCommentUpdateModal = ({setUpdateQuestionChildCommentId}: QuestionPage__QuestionChildCommentUpdateModalProps) => {

    const {theme} = useContext(ThemeContext)
    const {modalState, closeModal} = useContext(ModalContext)
    const questionId = modalState[ModalTypes.QUESTION_CHILD_COMMENT_UPDATE].data.questionId
    const questionCommentId = modalState[ModalTypes.QUESTION_CHILD_COMMENT_UPDATE].data.questionCommentId
    const questionChildCommentId = modalState[ModalTypes.QUESTION_CHILD_COMMENT_UPDATE].data.questionChildCommentId

    const updateQuestionChildCommentForm = useForm<UpdateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    });

    // 댓글 전체 조회 안에서 대댓글 조회 가능
    const {
        data: comments,
        refetch: questionCommentsRefetch,
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionPage__QuestionComments', questionId]
        }
    });

    const {mutate: updateQuestionChildComment} = useUpdateQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답변이 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                setUpdateQuestionChildCommentId("")
                await questionCommentsRefetch()
                closeModal({name: ModalTypes.QUESTION_CHILD_COMMENT_UPDATE})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
            }
        }
    })

    // 대댓글 조회 시 배열이 너무 많음..
    const questionComment = comments?.filter((comment) => (comment.id === questionCommentId))
    const questionChildComments = questionComment
        ?.filter(comment => comment.id === questionCommentId)
        ?.flatMap(comment => comment.childQuestionComments);
    const content = questionChildComments?.map((questionChildComment) => questionChildComment?.content)

    // 대댓글이 배열로 나와서 string으로 변환
    const convertToStringContent = content?.filter(Boolean).join('');

    const onUpdateQuestionCommentSubmit = (data: UpdateQuestionCommentForm) => updateQuestionChildComment({
        questionId: questionId!,
        questionCommentId: questionChildCommentId,
        data: data,
    });

    const handleUpdateQuestionChildCommentSubmit = (data: UpdateQuestionCommentForm) => {

        if (!data.content) {
            toast.warn("내용을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
            });
            return
        }

        if (data.content) {
            onUpdateQuestionCommentSubmit(data)
        }
    }

    useEffect(() => {
        if (comments) {
            updateQuestionChildCommentForm.reset(
                {
                    content: convertToStringContent
                }
            )
        }
    }, [comments]);

    return (
        <Dialog open={modalState[ModalTypes.QUESTION_CHILD_COMMENT_UPDATE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[80%] lg:min-w-[60%] h-auto rounded-lg z-50 outline-0 px-3 py-5 sm:p-5">

                <form onSubmit={updateQuestionChildCommentForm.handleSubmit(handleUpdateQuestionChildCommentSubmit)}>
                    <DialogHeader className="flex justify-center items-center">
                        <DialogTitle>답변 수정</DialogTitle>
                    </DialogHeader>

                    <div
                        className="flex bg-transparent py-5">
                        <div
                            className="flex-1 h-[580px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                            <Controller
                                control={updateQuestionChildCommentForm.control}
                                name="content"
                                render={({field: {onChange, value}}) => (
                                    <CustomMonacoEditor
                                        width={`${100}%`}
                                        height={`${100}%`}
                                        language="markdown"
                                        value={value}
                                        onChange={onChange}
                                        theme={theme === "light" ? "vs" : "vs-dark"}
                                        className="question_comment_css"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                        <Button
                            type="submit"
                            className="w-auto"
                        >
                            저장
                        </Button>
                        <DialogClose asChild>
                            <Button
                                className="hover:bg-secondary-hover"
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    closeModal({
                                        name: ModalTypes.QUESTION_CHILD_COMMENT_UPDATE
                                    });
                                }}
                            >
                                닫기
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default QuestionPage__QuestionChildCommentUpdateModal
