import {
    useFindAllCommentInfinite,
    useUpdateComment
} from "@/openapi/memo/api/post-comments/post-comments.ts";
import {Button} from "@/components/ui/button.tsx";
import {MdExpandMore} from "react-icons/md";
import {useParams} from "react-router-dom";
import timeSince from "@/components/utils/timeSince.tsx";
import Avatar from "react-avatar";
import {useContext, useState} from "react";
import userContext from "@/context/UserContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import DeleteComment from "@/components/post/DeleteComment.tsx";
import {toast} from "react-toastify";

const Comments = () => {

    const {postId} = useParams()
    const {authority} = useContext(userContext)
    const {openModal} = useContext(ModalContext)
    const [handleUpdateComment, setHandleUpdateComment] = useState("") // commentId로 핸들링
    const [updateCommentValue, setUpdateCommentValue] = useState("")

    const {
        data: comments,
        refetch: commentsRefetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFindAllCommentInfinite(
        postId!, {}, {
            query: {
                queryKey: ['Comments', postId],
                getNextPageParam: (lastPage) => {
                    if (!lastPage.last) {
                        return lastPage.number! + 1;
                    }
                },
            }
        });

    const {mutate: updateComment} = useUpdateComment({
        mutation: {
            onSuccess: async () => {
                setUpdateCommentValue("")
                setHandleUpdateComment("")
                toast.success("성공적으로 댓글이 수정되었습니다.")
                await commentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const onUpdateCommentSubmit = (commentId: string) => updateComment({
        memoId: postId!,
        commentId: commentId!,
        data: {
            content: updateCommentValue
        }
    })

    return (
        <>
            <div className="bg-background py-5 cursor-default">
                <div className="text-md font-bold leading-snug break-all space-x-1">
                    <span>댓글</span>
                    <span>{comments?.pages[0]?.totalElements}</span>
                </div>

                {comments?.pages.map((page) => (
                    page.content?.map((comment) => {
                        return (
                            <div
                                className="flex flex-col border-b border-b-gray-300 py-5">

                                <div className="flex justify-between mb-5">
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="flex items-center space-x-1 cursor-default">
                                            <Avatar
                                                className="w-6 h-6 rounded"
                                                name={comment.authorDTO?.username}
                                                size="25"
                                                round="5px"/>

                                            <div
                                                className="text-sm sm:text-md racking-wider">{comment.authorDTO?.username}</div>
                                        </div>

                                        <div className="text-xs text-gray-500 dark:text-gray-300">
                                            {timeSince(new Date(comment.createAt!))}
                                        </div>
                                    </div>


                                    <div className="flex space-x-0.5">
                                        <Button
                                            variant="ghost"
                                            className="hover:bg-secondary w-fit h-fit px-2 py-1 hover:text-indigo-500 dark:hover:text-indigo-500"
                                            type="submit"
                                        >
                                            <span>답글 달기</span>
                                        </Button>

                                        {authority === "USER" &&
                                            <>
                                                {handleUpdateComment === comment.id ?
                                                    <></>
                                                    :
                                                    <Button
                                                        onClick={() => {
                                                            setHandleUpdateComment(comment.id!)
                                                            setUpdateCommentValue(comment.content!)
                                                        }}
                                                        variant="link"
                                                        className="w-fit h-fit px-2 py-1 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                                                    >
                                                        수정
                                                    </Button>
                                                }

                                                <Button
                                                    onClick={() => {
                                                        openModal({
                                                            name: ModalTypes.BLOG_COMMENT_DELETE,
                                                            data: {
                                                                commentId: comment.id,
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
                                        }
                                    </div>
                                </div>

                                {handleUpdateComment === comment.id ?
                                    <>
                                        <textarea
                                            value={updateCommentValue}
                                            onChange={(event) => {
                                                setUpdateCommentValue(event.target.value)
                                            }}
                                            className="h-32 resize-none border border-gray-200 bg-background outline-none rounded p-2 mb-2">
                                        </textarea>

                                        <div className="flex space-x-1 justify-end">
                                            <Button
                                                onClick={() => {
                                                    onUpdateCommentSubmit(comment.id!)
                                                }}
                                                className="w-fit h-fit px-2 py-1.5 text-xs rounded text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                                            >
                                                저장
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setHandleUpdateComment("")
                                                }}
                                                className="w-fit h-fit px-2 py-1.5 text-xs rounded hover:bg-secondary-hover"
                                                type="button"
                                                variant="secondary"
                                            >
                                                닫기
                                            </Button>
                                        </div>
                                    </>
                                    :
                                    <div>{comment.content}</div>
                                }

                            </div>
                        )
                    })
                ))}
            </div>

            {hasNextPage && (
                <div className="flex my-2">
                    <Button
                        className="flex-1 bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200"
                        onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? '불러오는 중' : <MdExpandMore className="w-7 h-7"/>}
                    </Button>
                </div>
            )}

            <DeleteComment/>
        </>
    )
}

export default Comments