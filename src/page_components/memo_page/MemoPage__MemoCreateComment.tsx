import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {toast} from "react-toastify";
import {useParams} from "react-router-dom";
import {
    useCreateMemoComment,
    useFindAllMemoCommentInfinite
} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";

const MemoPage__MemoCreateComment = () => {

    const {memoId} = useParams();
    const [comment, setComment] = useState("")

    const {
        refetch: commentsRefetch,
    } = useFindAllMemoCommentInfinite(
        memoId!, {
            query: {
                queryKey: ['Comments', memoId],
                getNextPageParam: () => {},
            }
        });

    const {mutate: createComment} = useCreateMemoComment({
        mutation: {
            onSuccess: async () => {
                setComment("")
                toast.success("성공적으로 댓글이 등록되었습니다.")
                await commentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const onCreateCommentSubmit = () => createComment({
        memoId: memoId!,
        data: {
            content: comment
        }
    })

    return (
        <div className="flex flex-1 bg-background">
            <div className="flex-1 py-10">
                <div className="mb-1 text-gray-700 dark:text-gray-300">댓글</div>
                <div className="flex flex-1 space-x-2">
                    <textarea
                        value={comment}
                        onChange={(event) => {
                            setComment(event.target.value)
                        }}
                        className="flex-1 resize-none border border-gray-200 bg-background outline-none rounded h-32 p-2"></textarea>
                    <Button
                        onClick={() => {
                            if (!comment) {
                                toast.error("내용을 입력하세요.")
                                return
                            }

                            if (comment) {
                                onCreateCommentSubmit()
                            }
                        }}
                        className="flex w-24 h-32 bg-primary hover:bg-primary-hover text-white rounded p-2 justify-center items-center">
                        <div>등록</div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MemoPage__MemoCreateComment