import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Bounce, toast} from "react-toastify";
import {useDeleteMemoComment, useFindAllMemoComment} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const MemoPage__MemoDeleteCommentModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {theme} = useContext(ThemeContext)
    const [memoId, setMemoId] = useState<string>()
    const [commentId, setCommentId] = useState<string>()

    const {
        refetch: commentsRefetch,
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoPage__MemoComments', memoId],
            }
        });

    const {mutate: deleteComment} = useDeleteMemoComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 댓글이 삭제되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                await commentsRefetch();
                closeModal({name: ModalTypes.MEMO_COMMENT_DELETE})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
            },
        }
    })

    const onDeleteSubmit = () => deleteComment({
        memoId: memoId!,
        memoCommentId: commentId!
    })

    useEffect(() => {
        if (modalState[ModalTypes.MEMO_COMMENT_DELETE].isVisible) {
            setMemoId(modalState[ModalTypes.MEMO_COMMENT_DELETE].data.memoId)
            setCommentId(modalState[ModalTypes.MEMO_COMMENT_DELETE].data.commentId)
        }
    }, [modalState[ModalTypes.MEMO_COMMENT_DELETE]]);

    return (
        <Dialog open={modalState[ModalTypes.MEMO_COMMENT_DELETE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[250px] lg:min-w-[350px] rounded-lg z-50 outline-0 px-3 py-5 sm:p-5">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>삭제</DialogTitle>
                    <div className="flex flex-col py-5 items-center">
                        <span>댓글을 삭제하시겠습니까?</span>
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
                                    name: ModalTypes.MEMO_COMMENT_DELETE
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

export default MemoPage__MemoDeleteCommentModal