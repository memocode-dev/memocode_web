import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Bounce, toast} from "react-toastify";
import {useKeycloak} from "@/context/KeycloakContext";
import {useTheme} from "@/context/ThemeContext";
import {useCreateChildMemoComment, useFindAllMemoComment} from "@/openapi/api/memos/memos";

const MemoCreateChildCommentModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {isLogined} = useKeycloak()
    const {theme} = useTheme()
    const {memoId, commentId} = modalState[ModalTypes.MEMO_CHILD_COMMENT_CREATE].data
    const [childComment, setChildComment] = useState("")

    const {
        refetch: commentsRefetch,
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoComments', memoId],
            }
        });

    // 답글 생성
    const {mutate: createChildMemoComment} = useCreateChildMemoComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답글이 등록되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                closeModal({
                    name: ModalTypes.MEMO_CHILD_COMMENT_CREATE
                });
                setChildComment("")
                await commentsRefetch()
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

    // 답글 생성
    const onCreateChildCommentSubmit = () => createChildMemoComment({
        memoId: memoId!,
        memoCommentId: commentId!,
        data: {
            content: childComment
        }
    })

    return (
        <Dialog open={modalState[ModalTypes.MEMO_CHILD_COMMENT_CREATE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[80%] lg:min-w-[60%] h-auto rounded-lg z-50 outline-0 px-3 py-5 sm:p-6">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>답글 남기기</DialogTitle>
                </DialogHeader>

                <div
                    className="flex bg-transparent">
                     <textarea
                         placeholder="이 댓글에 대한 답글을 남겨보세요. 여러분의 의견이 큰 도움이 됩니다!"
                         value={childComment}
                         onChange={(event) => {
                             setChildComment(event.target.value)
                         }}
                         className="flex-1 resize-none border bg-background outline-none rounded h-32 p-2">
                    </textarea>
                </div>

                <DialogFooter className="flex-row flex justify-center sm:justify-end space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto"
                        onClick={() => {

                            if (!childComment) {
                                toast.error("내용을 입력하세요.", {
                                    position: "bottom-right",
                                    theme: theme,
                                    transition: Bounce,
                                    className: "text-sm",
                                });
                                return
                            }

                            if (!isLogined) {
                                toast.warning("로그인 후 이용가능합니다.", {
                                    position: "bottom-right",
                                    theme: theme,
                                    transition: Bounce,
                                    className: "text-sm",
                                });
                                return
                            }

                            if (childComment) {
                                onCreateChildCommentSubmit()
                            }
                        }}
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
                                    name: ModalTypes.MEMO_CHILD_COMMENT_CREATE
                                });
                                setChildComment("");
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

export default MemoCreateChildCommentModal