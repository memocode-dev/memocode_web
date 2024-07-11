import {useParams} from "react-router-dom";
import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {useFindMemo} from "@/openapi/api/memos/memos.ts";
import Avatar from "react-avatar";
import {Badge} from "@/components/ui/badge.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import renderMathInElement from 'katex/dist/contrib/auto-render';
import {useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import mermaid from "mermaid";
import MemoPage__MemoComments from "@/page_components/memo_page/MemoPage__MemoComments.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Bounce, toast} from "react-toastify";
import {useCreateMemoComment, useFindAllMemoComment,} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";
import {useKeycloak} from "@/context/KeycloakContext.tsx";

const MemoPage = () => {

    const {isLogined} = useKeycloak()
    const {memoId, username} = useParams();
    const {theme} = useContext(ThemeContext)
    const [comment, setComment] = useState("")
    const contentRef = useRef<HTMLDivElement>(null);

    if (!/^@[a-z\d]+$/.test(username as string)) {
        throw new Error();
    }

    const {data: memo} = useFindMemo(memoId!, {
        query: {
            queryKey: ['MemoPage', memoId!],
        }
    });

    const {
        data: comments,
        refetch: commentsRefetch,
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoPage__MemoComments', memoId],
            }
        });

    const {mutate: createComment} = useCreateMemoComment({
        mutation: {
            onSuccess: async () => {
                setComment("")
                toast.success("성공적으로 댓글이 등록되었습니다.", {
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

    const onCreateCommentSubmit = () => createComment({
        memoId: memoId!,
        data: {
            content: comment
        }
    })

    // 마크다운 + 수식 기호 HTML로 변환
    useEffect(() => {
        if(memo){
            if (contentRef.current) {
                // marked를 사용해 마크다운을 HTML로 변환
                const sanitizedHtml = MarkdownView.render(memo.content!);
                contentRef.current.innerHTML = sanitizedHtml;

                // KaTeX로 수식 렌더링
                renderMathInElement(contentRef.current, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                    ],
                });
            }
        }
    }, [memo]);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [memo, theme]);

    const MemoPage__Profile = (
        <>
            <div className="flex items-center space-x-1.5 cursor-pointer"
                // onClick={() => {
                //     navigate(`/@${memo?.user?.username}/about`)
                // }}
            >
                <Avatar
                    name={memo?.user?.username}
                    size="25"
                    round="3px"/>
                <div className="tracking-wider">{memo?.user?.username}</div>
            </div>

            <div>
                <div className="text-gray-500 dark:text-gray-300 tracking-wider">
                    {memo && memo?.createdAt && new Date(memo.createdAt).toLocaleDateString('ko-KR').slice(0, -1)}
                </div>
            </div>
        </>
    )

    const MemoPage__MemoCreateComment = (
        <div className="flex flex-1 space-x-2">
                    <textarea
                        value={comment}
                        onChange={(event) => {
                            setComment(event.target.value)
                        }}
                        className="flex-1 resize-none border bg-background outline-none rounded h-40 p-2"></textarea>
            <Button
                onClick={() => {
                    if (!comment) {
                        toast.error("내용을 입력하세요.", {
                            position: "bottom-right",
                            theme: theme,
                            transition: Bounce,
                        });
                        return
                    }

                    if (!isLogined) {
                        toast.warning("로그인 후 이용가능합니다.", {
                            position: "bottom-right",
                            theme: theme,
                            transition: Bounce,
                        });
                        return
                    }

                    if (comment) {
                        onCreateCommentSubmit()
                    }
                }}
                className="flex w-24 h-40 rounded p-2 justify-center items-center">
                <div>등록</div>
            </Button>
        </div>
    )

    return (
        <div
            className="flex flex-1 pb-12 md:pb-0 bg-background pt-32 overflow-y-auto mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[200px] 2xl:mx-[350px]">
            <div className="flex-1 w-full">
                <div className="bg-background border-b border-b-gray-400 pb-3">
                    <div className="text-2xl sm:text-[40px] font-bold leading-snug break-all">
                        {memo?.title}
                    </div>

                    <div className="flex flex-wrap py-4 cursor-default">
                        {memo?.tags?.map((tag: string, index) => {
                            return (
                                <div key={index}>
                                    <Badge
                                        className="text-md mx-1 my-1">{tag}</Badge>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-center">
                        {MemoPage__Profile}
                    </div>
                </div>

                <div className="bg-background border-b border-b-gray-400 py-14">
                    <div className="text-lg font-medium leading-snug break-all">
                        <div ref={contentRef} className="markdown-body w-full"></div>
                    </div>
                </div>

                <div className="flex flex-1 bg-background">
                    <div className="flex-1 py-10">
                        {comments && (
                            <div className="mb-1 font-bold text-gray-700 dark:text-gray-300">
                                {comments.reduce((total, comment) => total + (comment.childMemoComments ? comment.childMemoComments.length : 0), comments.length)}
                                개의 댓글
                            </div>
                        )}

                        {MemoPage__MemoCreateComment}
                    </div>
                </div>

                <MemoPage__MemoComments comments={comments!} commentsRefetch={commentsRefetch}/>
            </div>
        </div>

    )
}

export default MemoPage