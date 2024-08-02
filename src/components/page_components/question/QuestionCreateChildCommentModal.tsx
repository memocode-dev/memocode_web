'use client'

import {Button} from "@/components/ui/button";
import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Bounce, toast} from "react-toastify";
import {useTheme} from "@/context/ThemeContext";
import {useCreateChildQuestionComment, useFindAllQuestionComment} from "@/openapi/api/questions/questions";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor";

const QuestionCreateChildCommentModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {theme} = useTheme()
    const {questionId, questionCommentId} = modalState[ModalTypes.QUESTION_CHILD_COMMENT_CREATE].data
    const [childComment, setChildComment] = useState("")

    // 답변 전체 조회
    const {
        refetch: questionCommentsRefetch
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionComments', questionId]
        }
    });

    // 답글 생성
    const {mutate: createQuestionChildComment} = useCreateChildQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답글이 생성되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                setChildComment("")
                closeModal({
                    name: ModalTypes.QUESTION_CHILD_COMMENT_CREATE
                });
                await questionCommentsRefetch()
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

    const onCreateQuestionChildCommentSubmit = () => createQuestionChildComment({
        questionId: questionId!,
        questionCommentId: questionCommentId!,
        data: {
            content: childComment
        }
    });

    return (
        <div
            className={`
            ${modalState[ModalTypes.QUESTION_CHILD_COMMENT_CREATE]?.isVisible ? "fixed z-[100] top-0 bottom-0 left-0 right-0 bg-black/70 flex w-full h-full justify-center items-center" : "hidden"}
        `}
        >
            <div
                className="flex flex-col bg-background dark:bg-neutral-700 min-h-[90vh] h-[90%] w-[90%] lg:w-[70%] rounded-lg p-6 space-y-5">
                <div className="flex justify-center items-center">
                    <div>답글 남기기</div>
                </div>

                <div
                    className="h-[700px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                    <CustomMonacoEditor
                        key={questionId}
                        width={`${100}%`}
                        height={`${100}%`}
                        language="markdown"
                        theme={theme === "light" ? "vs" : "vs-dark"}
                        value={childComment}
                        onChange={(value) => {
                            setChildComment(value)
                        }}
                        className=""
                    />
                </div>

                <div className="flex flex-row justify-center sm:justify-center space-x-1">
                    <Button
                        onClick={() => {
                            if (!childComment) {
                                toast.warn("내용을 입력하세요.", {
                                    position: "bottom-right",
                                    theme: theme,
                                    transition: Bounce,
                                });
                                return
                            }

                            if (childComment) {
                                onCreateQuestionChildCommentSubmit()
                            }
                        }}
                        type="button"
                        className="rounded"
                    >
                        저장
                    </Button>

                    <Button
                        onClick={() => {
                            setChildComment("")
                            closeModal({
                                name: ModalTypes.QUESTION_CHILD_COMMENT_CREATE
                            });
                        }}
                        className="rounded hover:bg-secondary-hover"
                        type="button"
                        variant="secondary"
                    >
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default QuestionCreateChildCommentModal