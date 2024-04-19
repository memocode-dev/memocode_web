import {
    useCreateChildComment,
    useFindAllCommentInfinite,
    useUpdateComment
} from "@/openapi/memo/api/post-comments/post-comments.ts";
import {Button} from "@/components/ui/button.tsx";
import {MdExpandMore} from "react-icons/md";
import {useParams} from "react-router-dom";
import timeSince from "@/components/utils/timeSince.tsx";
import Avatar from "react-avatar";
import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import DeleteComment from "@/components/post/DeleteComment.tsx";
import {toast} from "react-toastify";
import {useKeycloak} from "@/context/KeycloakContext.tsx";

const Comments = () => {

    const {postId} = useParams()
    const {user_info, isLogined} = useKeycloak()
    const {openModal} = useContext(ModalContext)

    const [handleCommentIdForUpdateComment, setHandleCommentIdForUpdateComment] = useState("") // commentId로 핸들링
    const [updateCommentValue, setUpdateCommentValue] = useState("")

    const [handleCommentIdForCreateChildComment, setHandleCommentIdForCreateChildComment] = useState("") // commentId로 핸들링
    const [createChildCommentValue, setCreateChildCommentValue] = useState("")

    const [handleCommentIdForChildComments, setHandleCommentIdForChildComments] = useState("") // commentId로 핸들링

    // 댓글 조회
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

    // 댓글 수정
    const {mutate: updateComment} = useUpdateComment({
        mutation: {
            onSuccess: async () => {
                setHandleCommentIdForUpdateComment("")
                setUpdateCommentValue("")
                toast.success("성공적으로 댓글이 수정되었습니다.")
                await commentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    // 대댓글 생성
    const {mutate: createChildComment} = useCreateChildComment({
        mutation: {
            onSuccess: async () => {
                setHandleCommentIdForCreateChildComment("")
                setCreateChildCommentValue("")
                toast.success("성공적으로 답변이 등록되되었습니다.")
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

    const onCreateChildCommentSubmit = (commentId: string) => createChildComment({
        memoId: postId!,
        commentId: commentId!,
        data: {
            content: createChildCommentValue
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

                                {/* 댓글쓴이 프로필 */}
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
                                        {/* 답글 보기 / 달기 버튼 */}
                                        {comment.reply?.length ?
                                            <>
                                                {handleCommentIdForChildComments === comment.id ?
                                                    <Button
                                                        onClick={() => {
                                                            setHandleCommentIdForChildComments("")
                                                        }}
                                                        variant="ghost"
                                                        className="w-fit h-fit px-2 py-1 bg-secondary text-indigo-500 dark:text-indigo-500
                                                        hover:bg-secondary hover:text-indigo-500 dark:hover:text-indigo-500"
                                                        type="submit"
                                                    >
                                                        <span>답글 닫기</span>
                                                    </Button>
                                                    :
                                                    <Button
                                                        onClick={() => {
                                                            setHandleCommentIdForChildComments(comment.id!)
                                                        }}
                                                        variant="ghost"
                                                        className="w-fit h-fit px-2 py-1 hover:bg-secondary hover:text-indigo-500 dark:hover:text-indigo-500"
                                                        type="submit"
                                                    >
                                                        <span>답글 보기</span>
                                                    </Button>
                                                }
                                            </>
                                            :
                                            <Button
                                                onClick={() => {
                                                    if (!isLogined) {
                                                        toast.warn("로그인 후 이용 가능합니다.");
                                                        return;
                                                    }

                                                    setHandleCommentIdForCreateChildComment(comment.id!)
                                                }}
                                                variant="ghost"
                                                className={`
                                                ${handleCommentIdForCreateChildComment === comment.id ? `bg-secondary text-indigo-500 dark:text-indigo-500` : ``}
                                                w-fit h-fit px-2 py-1 hover:bg-secondary hover:text-indigo-500 dark:hover:text-indigo-500`}
                                                type="submit"
                                            >
                                                <span>답글 달기</span>
                                            </Button>
                                        }

                                        {/* 수정 / 삭제 버튼 */}
                                        {user_info?.id === comment.authorDTO?.authorId &&
                                            <>
                                                {handleCommentIdForUpdateComment === comment.id ?
                                                    <></>
                                                    :
                                                    <Button
                                                        onClick={() => {
                                                            setHandleCommentIdForUpdateComment(comment.id!)
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

                                {/* 댓글 내용 표시 / 수정 폼 */}
                                {updateCommentValue && handleCommentIdForUpdateComment === comment.id ?
                                    <>
                                        <textarea
                                            value={updateCommentValue}
                                            onChange={(event) => {
                                                setUpdateCommentValue(event.target.value)
                                            }}
                                            className="h-32 resize-none border border-gray-200 dark:border-gray-400 bg-background outline-none rounded p-2 mb-5">
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
                                                    setUpdateCommentValue("")
                                                    setHandleCommentIdForUpdateComment("")
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

                                {/* 답글 리스트 */}
                                {handleCommentIdForChildComments === comment.id &&
                                    <div
                                        className="flex-1 flex flex-col bg-gray-100 dark:bg-neutral-900 px-7 pb-7 mt-5">
                                        {comment.reply?.map((childComment) => {
                                            return (
                                                <div className="pt-7">
                                                    <div className="flex items-center space-x-2 mb-5">
                                                        <div
                                                            className="flex items-center space-x-1 cursor-default">
                                                            <Avatar
                                                                className="w-6 h-6 rounded"
                                                                name={childComment.authorDTO?.username}
                                                                size="25"
                                                                round="5px"/>

                                                            <div
                                                                className="text-sm sm:text-md racking-wider">{childComment.authorDTO?.username}</div>
                                                        </div>

                                                        <div className="text-xs text-gray-500 dark:text-gray-300">
                                                            {timeSince(new Date(childComment.createAt!))}
                                                        </div>
                                                    </div>

                                                    <div className="">{childComment.content}</div>
                                                </div>
                                            )
                                        })}

                                    </div>
                                }

                                {/* 답글 등록 폼 */}
                                {handleCommentIdForCreateChildComment === comment.id ?
                                    <div
                                        className="flex-1 flex flex-col bg-gray-100 dark:bg-neutral-900 px-7 py-7 mt-5">
                                        <textarea
                                            placeholder="내용을 입력하세요"
                                            value={createChildCommentValue}
                                            onChange={(event) => {
                                                setCreateChildCommentValue(event.target.value)
                                            }}
                                            className="flex h-32 resize-none border border-gray-200 dark:border-gray-500 bg-background outline-none rounded p-2 mb-5 placeholder:text-gray-400">
                                        </textarea>

                                        <div className="flex space-x-1 justify-end">
                                            <Button
                                                onClick={() => {
                                                    onCreateChildCommentSubmit(comment.id!)
                                                }}
                                                className="w-fit h-fit px-2 py-1.5 text-xs rounded text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                                            >
                                                저장
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setCreateChildCommentValue("")
                                                    setHandleCommentIdForCreateChildComment("")
                                                }}
                                                className="w-fit h-fit px-2 py-1.5 text-xs rounded hover:bg-secondary-hover"
                                                type="button"
                                                variant="secondary"
                                            >
                                                닫기
                                            </Button>
                                        </div>
                                    </div>
                                    :
                                    <></>
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