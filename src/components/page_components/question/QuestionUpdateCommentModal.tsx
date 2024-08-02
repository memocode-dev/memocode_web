'use client'

import {Button} from "@/components/ui/button";
import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Controller, useForm} from "react-hook-form";
import {
    UpdateQuestionCommentForm
} from "@/openapi/model";
import {Bounce, toast} from "react-toastify";
import {useTheme} from "@/context/ThemeContext";
import {useFindAllQuestionComment, useUpdateQuestionComment} from "@/openapi/api/questions/questions";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor";

const QuestionUpdateCommentModal = () => {

    const {theme} = useTheme()
    const {modalState, closeModal} = useContext(ModalContext)
    const {questionId, questionComment} = modalState[ModalTypes.QUESTION_COMMENT_UPDATE].data

    const {
        refetch: questionCommentsRefetch,
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionComments', questionId]
        }
    });

    const {mutate: updateQuestionComment} = useUpdateQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답변/답글이 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await questionCommentsRefetch()
                closeModal({name: ModalTypes.QUESTION_COMMENT_UPDATE})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            }
        }
    })

    const onUpdateQuestionCommentSubmit = (data: UpdateQuestionCommentForm) => updateQuestionComment({
        questionId: questionId!,
        questionCommentId: questionComment!.id!,
        data: data,
    });

    const handleUpdateQuestionSubmit = (data: UpdateQuestionCommentForm) => {

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
            onUpdateQuestionCommentSubmit(data)
        }
    }

    const updateQuestionCommentForm = useForm<UpdateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    });

    useEffect(() => {
        if (questionComment) {
            updateQuestionCommentForm.reset(
                {
                    content: questionComment?.content
                }
            )
        }
    }, [questionComment]);

    return (
        <div
            className={`
            ${modalState[ModalTypes.QUESTION_COMMENT_UPDATE]?.isVisible ? "fixed z-[100] top-0 bottom-0 left-0 right-0 bg-black/70 flex w-full h-full justify-center items-center" : "hidden"}
        `}
        >
            <form
                onSubmit={updateQuestionCommentForm.handleSubmit(handleUpdateQuestionSubmit)}
                className="flex flex-col bg-background dark:bg-neutral-700 min-h-[90vh] h-[90%] w-[90%] lg:w-[70%] rounded-lg p-6 space-y-5">
                <div className="flex justify-center items-center">
                    <div>답변 / 답글 수정</div>
                </div>

                <Controller
                    control={updateQuestionCommentForm.control}
                    name="content"
                    render={({field: {onChange, value}}) => (
                        <div
                            className="h-[700px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                            <CustomMonacoEditor
                                width={`${100}%`}
                                height={`${100}%`}
                                language="markdown"
                                value={value}
                                onChange={onChange}
                                theme={theme === "light" ? "vs" : "vs-dark"}
                                className=""
                            />
                        </div>
                    )}
                />

                <div className="flex flex-row justify-center sm:justify-center space-x-1">
                    <Button
                        type="submit"
                        className="rounded"
                    >
                        저장
                    </Button>

                    <Button
                        onClick={() => {
                            closeModal({
                                name: ModalTypes.QUESTION_COMMENT_UPDATE
                            });
                        }}
                        className="rounded hover:bg-secondary-hover"
                        type="button"
                        variant="secondary"
                    >
                        닫기
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default QuestionUpdateCommentModal
