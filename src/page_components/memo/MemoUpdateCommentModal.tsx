import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Bounce, toast} from "react-toastify";
import {
    useFindAllMemoComment,
    useUpdateMemoComment
} from "@/openapi/api/memos-memocomments/memos-memocomments";
import {UpdateMemoCommentForm} from "@/openapi/model";
import {useTheme} from "@/context/ThemeContext";
import {Controller, useForm} from "react-hook-form";

const MemoUpdateCommentModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {theme} = useTheme()
    const {memoId, comment} = modalState[ModalTypes.MEMO_COMMENT_UPDATE].data

    const {
        refetch: commentsRefetch,
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoComments', memoId],
            }
        });

    // 댓글 수정
    const {mutate: updateMemoComment} = useUpdateMemoComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 댓글이 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                closeModal({
                    name: ModalTypes.MEMO_COMMENT_UPDATE
                });
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

    const updateMemoCommentForm = useForm<UpdateMemoCommentForm>({
        defaultValues: {
            content: ""
        }
    });

    // 댓글 수정
    const onUpdateCommentSubmit = (data: UpdateMemoCommentForm) => updateMemoComment({
        memoId: memoId!,
        memoCommentId: comment!.id!,
        data: data,
    });

    const handleUpdateMemoCommentSubmit = (data: UpdateMemoCommentForm) => {

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
            onUpdateCommentSubmit(data)
        }
    }

    useEffect(() => {
        if (comment) {
            updateMemoCommentForm.reset(
                {
                    content: comment.content
                }
            )
        }
    }, [comment]);

    return (
        <Dialog open={modalState[ModalTypes.MEMO_COMMENT_UPDATE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[80%] lg:min-w-[60%] h-auto rounded-lg z-50 outline-0 px-3 py-5 sm:p-6">

                <form onSubmit={updateMemoCommentForm.handleSubmit(handleUpdateMemoCommentSubmit)}>
                    <DialogHeader className="flex justify-center items-center">
                        <DialogTitle>댓글/답글 수정</DialogTitle>
                    </DialogHeader>

                    <div
                        className="flex bg-transparent py-6">
                        <Controller
                            control={updateMemoCommentForm.control}
                            name="content"
                            render={({field: {onChange, value}}) => (
                                <textarea
                                    value={value}
                                    onChange={onChange}
                                    placeholder="댓글을 남겨보세요!"
                                    className="flex-1 resize-none border bg-background outline-none rounded h-40 p-2">

                                 </textarea>
                            )}
                        />
                    </div>

                    <DialogFooter className="flex-row flex justify-center sm:justify-end space-x-3 sm:space-x-3">
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
                                        name: ModalTypes.MEMO_COMMENT_UPDATE
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

export default MemoUpdateCommentModal