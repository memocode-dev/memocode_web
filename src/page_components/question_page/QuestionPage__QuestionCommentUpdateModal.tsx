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
import {toast} from "react-toastify";

const QuestionPage__QuestionCommentUpdateModal = () => {

    const {theme} = useContext(ThemeContext)
    const {modalState, closeModal} = useContext(ModalContext)
    const questionId = modalState[ModalTypes.QUESTION_COMMENT_UPDATE].data.questionId
    const questionCommentId = modalState[ModalTypes.QUESTION_COMMENT_UPDATE].data.questionCommentId

    const updateQuestionCommentForm = useForm<UpdateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    });

    const {
        data: comments,
        refetch: questionCommentsRefetch,
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionPage__QuestionAnswer', questionId]
        }
    });

    const {mutate: updateQuestionComment} = useUpdateQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답변이 수정되었습니다.")
                await questionCommentsRefetch()
                closeModal({name: ModalTypes.QUESTION_COMMENT_UPDATE})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const questionCommentForUpdate = comments?.filter((comment) => (comment.id === questionCommentId))
    const questionCommentContent = questionCommentForUpdate?.map((comment) => (comment.content))
    const convertToStringContent = questionCommentContent?.filter(Boolean).join('');

    const onUpdateQuestionCommentSubmit = (data: UpdateQuestionCommentForm) => updateQuestionComment({
        questionId: questionId!,
        questionCommentId: questionCommentId,
        data: data,
    });

    const handleCreateQuestionSubmit = (data: UpdateQuestionCommentForm) => {

        if (!data.content) {
            toast.warn("내용을 입력하세요.")
            return
        }

        if (data.content) {
            onUpdateQuestionCommentSubmit(data)
        }
    }

    useEffect(() => {
        if (comments) {
            updateQuestionCommentForm.reset(
                {
                    content: convertToStringContent
                }
            )
        }
    }, [comments]);

    return (
        <Dialog open={modalState[ModalTypes.QUESTION_COMMENT_UPDATE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[80%] lg:min-w-[60%] h-auto rounded-lg z-50 dark:bg-neutral-700 outline-0 px-3 py-5 sm:p-5">

                <form onSubmit={updateQuestionCommentForm.handleSubmit(handleCreateQuestionSubmit)}>
                    <DialogHeader className="flex justify-center items-center">
                        <DialogTitle>답변 수정</DialogTitle>
                    </DialogHeader>

                    <div
                        className="flex bg-transparent py-5">
                        <div
                            className="flex-1 h-[580px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                            <Controller
                                control={updateQuestionCommentForm.control}
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
                            className="w-auto text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                        name: ModalTypes.QUESTION_COMMENT_UPDATE
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

export default QuestionPage__QuestionCommentUpdateModal
