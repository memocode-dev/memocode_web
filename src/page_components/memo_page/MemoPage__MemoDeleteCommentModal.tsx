import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import {
    useDeleteMemoComment,
    useFindAllMemoCommentInfinite
} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";

const MemoPage__MemoDeleteCommentModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {memoId} = useParams()

    const {
        refetch: commentsRefetch,
    } = useFindAllMemoCommentInfinite(
        memoId!, {
            query: {
                queryKey: ['Comments', memoId],
                getNextPageParam: () => {},
            }
        });

    const {mutate: deleteComment} = useDeleteMemoComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 댓글이 삭제되었습니다.");
                await commentsRefetch();
                closeModal({name: ModalTypes.BLOG_COMMENT_DELETE})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            },
        }
    })

    const onDeleteSubmit = () => deleteComment({
        memoId: memoId!,
        memoCommentId: modalState[ModalTypes.BLOG_COMMENT_DELETE].data.commentId
    })

    return (
        <Dialog open={modalState[ModalTypes.BLOG_COMMENT_DELETE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[250px] lg:min-w-[350px] rounded-lg z-50 dark:bg-neutral-700 outline-0 px-3 py-5 sm:p-5">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>삭제</DialogTitle>
                    <div className="flex flex-col py-5 items-center">
                        <span>댓글을 삭제하시겠습니까?</span>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                    name: ModalTypes.BLOG_COMMENT_DELETE
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