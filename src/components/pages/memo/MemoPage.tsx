'use client'

import {FindMemoMemoResult} from "@/openapi/model";
import {useKeycloak} from "@/context/KeycloakContext";
import {useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext";
import Avatar from "react-avatar";
import {Button} from "@/components/ui/button";
import {Bounce, toast} from "react-toastify";
import MarkdownView from "@/components/ui/MarkdownView";
import 'katex/dist/katex.min.css';
import renderMathInElement from 'katex/contrib/auto-render';
import mermaid from "mermaid";
import {Badge} from "@/components/ui/badge";
import {useParams, useRouter} from "next/navigation";
import {useCreateMemoComment, useFindAllMemoComment, useFindMemo} from "@/openapi/api/memos/memos";
import MemoComments from "@/components/page_components/memo/MemoComments";

interface MemoPageProps {
    searchMemo: FindMemoMemoResult;
}

const MemoPage = ({searchMemo}: MemoPageProps) => {

    const {isLogined} = useKeycloak()
    const {theme} = useContext(ThemeContext)
    const params = useParams<{ memoId: string }>();
    const memoId = params?.memoId || '';
    const [comment, setComment] = useState("")
    const contentRef = useRef<HTMLDivElement>(null);
    const router = useRouter()

    const {data: memo} = useFindMemo(memoId!, {
        query: {
            queryKey: ['MemoPage', memoId, searchMemo],
            initialData: searchMemo
        }
    });

    const {
        data: comments,
        refetch: commentsRefetch,
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoComments', memoId],
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
                    className: "text-sm",
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

    const onCreateCommentSubmit = () => createComment({
        memoId: memoId!,
        data: {
            content: comment
        }
    })

    // 마크다운 + 수식 기호 HTML로 변환
    useEffect(() => {
        if (memo) {
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

    const MemoProfile = (
        <>
            <div className="flex items-center space-x-1.5 cursor-pointer"
                 onClick={() => typeof window !== 'undefined' && router.push(`/@${memo?.user?.username}/about`)}
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

    const MemoCreateComment = (
        <div className="flex flex-1 space-x-2">
            <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="이 글이 도움이 되셨다면, 댓글을 남겨보세요!"
                className="flex-1 resize-none border bg-background outline-none rounded h-40 p-2">

            </textarea>

            <Button
                onClick={() => {
                    if (!comment) {
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
                    {MemoProfile}
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

                    {MemoCreateComment}
                </div>
            </div>

            <MemoComments memoId={memoId} comments={comments!}/>
        </div>
    )
}

export default MemoPage;