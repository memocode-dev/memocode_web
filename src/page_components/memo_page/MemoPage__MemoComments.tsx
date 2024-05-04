import {Button} from "@/components/ui/button.tsx";
import {useParams} from "react-router-dom";
import timeSince from "@/components/utils/timeSince.tsx";
import Avatar from "react-avatar";
import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {toast} from "react-toastify";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import {
    useCreateChildMemoComment,
    useFindAllMemoComment,
    useUpdateMemoComment
} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";
import MemoPage__MemoDeleteCommentModal from "@/page_components/memo_page/MemoPage__MemoDeleteCommentModal.tsx";
import {FindAllMemoCommentMemoCommentResult} from "@/openapi/model";

const MemoPage__MemoComments = () => {

    const {memoId} = useParams()
    const {user_info, isLogined} = useKeycloak()
    const {openModal} = useContext(ModalContext)

    const [handleCommentIdForUpdateComment, setHandleCommentIdForUpdateComment] = useState("")
    const [updateCommentValue, setUpdateCommentValue] = useState("")

    const [handleCommentIdForCreateChildComment, setHandleCommentIdForCreateChildComment] = useState("")
    const [createChildCommentValue, setCreateChildCommentValue] = useState("")

    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

    // 댓글 조회
    const {
        data: comments,
        refetch: commentsRefetch
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoPage__MemoComments', memoId],
            }
        });

    // 댓글 수정
    const {mutate: updateMemoComment} = useUpdateMemoComment({
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
    const {mutate: createChildMemoComment} = useCreateChildMemoComment({
        mutation: {
            onSuccess: async () => {
                setHandleCommentIdForCreateChildComment("")
                setCreateChildCommentValue("")
                toast.success("성공적으로 답변이 등록되었습니다.")
                await commentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const onUpdateCommentSubmit = (commentId: string) => updateMemoComment({
        memoId: memoId!,
        memoCommentId: commentId,
        data: {
            content: updateCommentValue
        }
    })

    const onCreateChildCommentSubmit = (commentId: string) => createChildMemoComment({
        memoId: memoId!,
        memoCommentId: commentId!,
        data: {
            content: createChildCommentValue
        }
    })

    // 댓글 표시 상태를 토글하는 함수
    const toggleShowComment = (commentId: string) => {
        setShowComments(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId] // 현재 상태의 반대로 설정합니다.
        }));
    };


    const MemoPage__MemoComments__WriterProfile = (comment: FindAllMemoCommentMemoCommentResult) => (
        <>
            <div
                className="flex items-center space-x-1 cursor-default">
                <Avatar
                    className="w-6 h-6 rounded"
                    name={comment.user?.username}
                    size="25"
                    round="5px"/>

                <div
                    className="text-sm sm:text-md racking-wider">{comment.user?.username}</div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
                {timeSince(new Date(comment.createdAt!))}
            </div>
        </>
    )

    return (
        <>
            <div className="bg-background py-5 cursor-default">
                <div className="text-md font-bold leading-snug break-all space-x-1">
                    <span>댓글</span>
                </div>

                {comments?.map((comment) => {
                    return (
                        <div
                            className="flex flex-col border-b border-b-gray-300 py-5">

                            <div className="flex justify-between mb-5">

                                {/* 댓글쓴이 프로필 */}
                                <div className="flex items-center space-x-2">
                                    {MemoPage__MemoComments__WriterProfile(comment)}
                                </div>

                                {/* 답글 달기 / 닫기 / 보기 버튼 */}
                                <div className="flex space-x-0.5">
                                    {comment.childMemoComments?.length !== 0 &&
                                        <>
                                            <Button
                                                onClick={() => {
                                                    toggleShowComment(comment.id!)
                                                }}
                                                variant="ghost"
                                                className="w-fit h-fit px-2 py-1 bg-secondary text-indigo-500 dark:text-indigo-500
                                                        hover:bg-secondary hover:text-indigo-500 dark:hover:text-indigo-500"
                                                type="submit"
                                            >
                                                <span>{showComments[comment.id!] ? "답글보기" : "답글닫기"}</span>
                                            </Button>
                                        </>}

                                    {comment.childMemoComments?.length === 0 &&
                                        <>
                                            <Button
                                                onClick={() => {
                                                    if (!isLogined) {
                                                        toast.warn("로그인 후 이용 가능합니다.");
                                                        return;
                                                    }

                                                    setHandleCommentIdForCreateChildComment(comment.id!)
                                                }}
                                                variant="ghost"
                                                className={`${handleCommentIdForCreateChildComment === comment.id ? `bg-secondary text-indigo-500 dark:text-indigo-500` : ``}
                                                                    w-fit h-fit px-2 py-1 hover:bg-secondary hover:text-indigo-500 dark:hover:text-indigo-500`}
                                                type="submit"
                                            >
                                                <span>답글 달기</span>
                                            </Button>
                                        </>}

                                    {/* 수정 / 삭제 버튼 */}
                                    {!comment.deleted && user_info?.id === comment.user?.id &&
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
                            {comment.childMemoComments?.length !== 0 && !showComments[comment.id!] &&
                                <div
                                    className="flex-1 flex flex-col bg-gray-100 dark:bg-neutral-900 px-7 pb-7 mt-5">
                                    {comment.childMemoComments?.map((childComment) => {
                                        console.log("showComments", showComments)
                                        return (
                                            <div className="pt-7">
                                                <div className="flex items-center space-x-2 mb-5">
                                                    <div
                                                        className="flex items-center space-x-1 cursor-default">
                                                        <Avatar
                                                            className="w-6 h-6 rounded"
                                                            name={childComment.user?.username}
                                                            size="25"
                                                            round="5px"/>

                                                        <div
                                                            className="text-sm sm:text-md racking-wider">{childComment.user?.username}</div>
                                                    </div>

                                                    <div
                                                        className="text-xs text-gray-500 dark:text-gray-300">
                                                        {timeSince(new Date(childComment.createdAt!))}
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
                })}
            </div>

            <MemoPage__MemoDeleteCommentModal/>
        </>
    )
}

export default MemoPage__MemoComments