'use client'

import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Bounce, toast} from "react-toastify";
import {useTheme} from "@/context/ThemeContext";
import {useDeleteQuestionComment, useFindAllQuestionComment} from "@/openapi/api/questions/questions";

const QuestionDeleteCommentModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {questionId, questionCommentId} = modalState[ModalTypes.QUESTION_COMMENT_DELETE].data
    const {theme} = useTheme()

    const {
        refetch: questionCommentsRefetch,
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionComments', questionId]
        }
    });

    const {mutate: deleteQuestionComment} = useDeleteQuestionComment({
        mutation: {
            onSuccess: async () => {
                closeModal({name: ModalTypes.QUESTION_COMMENT_DELETE})
                toast.success("성공적으로 답변/답글이 삭제되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm"
                });
                await questionCommentsRefetch();

            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm"
                });
            },
        }
    })

    const onDeleteSubmit = () => deleteQuestionComment(
        {
            questionId: questionId!,
            questionCommentId: questionCommentId
        }
    )

    return (
        <Dialog open={modalState[ModalTypes.QUESTION_COMMENT_DELETE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[250px] lg:min-w-[350px] rounded-lg z-50 outline-0 px-3 py-5 sm:p-5">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>삭제</DialogTitle>
                    <div className="flex flex-col py-5 items-center">
                        <span>답변/답글을 삭제하시겠습니까?</span>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto"
                        onClick={onDeleteSubmit}
                    >
                        확인
                    </Button>
                    <DialogClose asChild>
                        <Button
                            className="hover:bg-secondary-hover"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                closeModal({
                                    name: ModalTypes.QUESTION_COMMENT_DELETE
                                });
                            }}
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default QuestionDeleteCommentModal
