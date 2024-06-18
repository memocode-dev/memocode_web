import {FindAllMemoCommentMemoCommentResult} from "@/openapi/model";
import Avatar from "react-avatar";
import timeSince from "@/components/utils/timeSince.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Bounce, toast} from "react-toastify";
import {
    useCreateChildMemoComment,
    useFindAllMemoComment,
    useUpdateMemoComment
} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";
import {useContext, useState} from "react";
import {useParams} from "react-router-dom";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";

interface MemoChildCommentsProps {
    comment: FindAllMemoCommentMemoCommentResult;
    showComments: { [key: string]: boolean };
    handleCommentIdForCreateChildComment: string;
    setHandleCommentIdForCreateChildComment: (childCommentId: string) => void;

}

const MemoPage__MemoChildComments = ({
                                         comment,
                                         showComments,
                                         handleCommentIdForCreateChildComment,
                                         setHandleCommentIdForCreateChildComment
                                     }: MemoChildCommentsProps) => {

    const {theme} = useContext(ThemeContext)
    const {user_info} = useKeycloak()
    const {openModal} = useContext(ModalContext)
    const {memoId} = useParams()
    const [createChildCommentValue, setCreateChildCommentValue] = useState("")

    const [handleChildCommentIdForUpdateChildComment, setHandleChildCommentIdForUpdateChildComment] = useState("")
    const [updateChildCommentValue, setUpdateChildCommentValue] = useState<string>()

    // 댓글 전체 조회
    const {
        refetch: commentsRefetch
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoPage__MemoComments', memoId],
            }
        });

    // 데댓글 수정
    const {mutate: updateChildMemoComment} = useUpdateMemoComment({
        mutation: {
            onSuccess: async () => {
                setHandleChildCommentIdForUpdateChildComment("")
                setUpdateChildCommentValue("")
                toast.success("성공적으로 답글이 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                await commentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
            }
        }
    })

    // 대댓글 생성
    const {mutate: createChildMemoComment} = useCreateChildMemoComment({
        mutation: {
            onSuccess: async () => {
                setHandleCommentIdForCreateChildComment("")
                setCreateChildCommentValue("")
                toast.success("성공적으로 답글이 등록되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                await commentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
            }
        }
    })

    // 대댓글 수정
    const onUpdateChildCommentSubmit = (childCommentId: string) => updateChildMemoComment({
        memoId: memoId!,
        memoCommentId: childCommentId,
        data: {
            content: updateChildCommentValue
        }
    })

    // 대댓글 생성
    const onCreateChildCommentSubmit = (childCommentId: string) => createChildMemoComment({
        memoId: memoId!,
        memoCommentId: childCommentId!,
        data: {
            content: createChildCommentValue
        }
    })

    const MemoPage__MemoChildComments__WritterProfile = (childComment: FindAllMemoCommentMemoCommentResult) => (
        <>
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
        </>
    )

    const MemoPage__MemoChildComments__ChildCommentEditButtons = (childComment: FindAllMemoCommentMemoCommentResult) => (
        <>
            <Button
                onClick={() => {
                    setHandleChildCommentIdForUpdateChildComment(childComment.id!)
                    setUpdateChildCommentValue(childComment.content!)
                }}
                variant="link"
                className="w-fit h-fit px-2 py-1 text-gray-400 hover:text-primary"
            >
                수정
            </Button>

            <Button
                onClick={() => {
                    openModal({
                        name: ModalTypes.BLOG_COMMENT_DELETE,
                        data: {
                            commentId: childComment.id,
                        }
                    });
                }}
                type="button"
                variant="link"
                className="w-fit h-fit px-0 py-1 text-gray-400 hover:text-primary"
            >
                삭제
            </Button>
        </>
    )

    const MemoPage__MemoComments__CreateChildCommentForm = (comment: FindAllMemoCommentMemoCommentResult) => (
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
                    className="w-fit h-fit px-2 py-1.5 text-xs rounded"
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
    )

    return (
        <>
            {/* 답글 조회 */}
            {comment.childMemoComments?.length !== 0 && !showComments[comment.id!] &&
                <div
                    className="flex-1 flex flex-col bg-gray-100 dark:bg-neutral-900 px-7 pb-7 mt-5">

                    {comment.childMemoComments?.map((childComment) => {
                        return (
                            <div className="pt-7">
                                <div className="flex justify-between mb-5">
                                    <div className="flex items-center space-x-2">

                                        {/* 대댓글쓴이 프로필 */}
                                        {MemoPage__MemoChildComments__WritterProfile(childComment)}

                                    </div>

                                    {/* 대댓글 수정 / 삭제 버튼 */}
                                    <div className="flex space-x-0.5">
                                        {!childComment.deleted && user_info?.id === childComment.user?.id &&
                                            MemoPage__MemoChildComments__ChildCommentEditButtons(childComment)
                                        }
                                    </div>
                                </div>

                                {/* 대댓글 내용 표시 / 수정 폼 */}
                                {handleChildCommentIdForUpdateChildComment === childComment.id ?
                                    <>
                                        <textarea
                                            value={updateChildCommentValue}
                                            onChange={(event) => {
                                                setUpdateChildCommentValue(event.target.value)
                                            }}
                                            className="w-full h-32 resize-none border border-gray-200 dark:border-gray-400 bg-background outline-none rounded p-2 mb-5">
                                        </textarea>

                                        <div className="flex space-x-1 justify-end">
                                            <Button
                                                onClick={() => {
                                                    if (!updateChildCommentValue) {
                                                        toast.warn("내용을 입력하세요.", {
                                                            position: "bottom-right",
                                                            theme: theme,
                                                            transition: Bounce,
                                                        });
                                                        return
                                                    }
                                                    onUpdateChildCommentSubmit(childComment.id!)
                                                }}
                                                className="w-fit h-fit px-2 py-1.5 text-xs rounded"
                                            >
                                                저장
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setUpdateChildCommentValue("")
                                                    setHandleChildCommentIdForUpdateChildComment("")
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
                                    <div>{childComment.content}</div>
                                }

                            </div>
                        )
                    })}

                </div>
            }

            {/* 답글 등록 폼 */}
            {handleCommentIdForCreateChildComment === comment.id &&
                MemoPage__MemoComments__CreateChildCommentForm(comment)
            }
        </>
    )
}

export default MemoPage__MemoChildComments;