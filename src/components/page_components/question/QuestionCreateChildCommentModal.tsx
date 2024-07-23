'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useContext, useEffect, useRef, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Bounce, toast} from "react-toastify";
import {useTheme} from "@/context/ThemeContext";
import {useCreateChildQuestionComment, useFindAllQuestionComment} from "@/openapi/api/questions/questions";
import dynamic from 'next/dynamic';

const CustomMonacoEditor = dynamic(() => import('@/components/common/CustomMonacoEditor'), {
    ssr: false
});

const QuestionCreateChildCommentModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {theme} = useTheme()
    const {questionId, questionCommentId} = modalState[ModalTypes.QUESTION_CHILD_COMMENT_CREATE].data
    const [childComment, setChildComment] = useState("")
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

    // 답변 전체 조회
    const {
        refetch: questionCommentsRefetch
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionComments', questionId]
        }
    });

    // 답글 생성
    const {mutate: createQuestionChildComment} = useCreateChildQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답글이 생성되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                setChildComment("")
                closeModal({
                    name: ModalTypes.QUESTION_CHILD_COMMENT_CREATE
                });
                await questionCommentsRefetch()
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

    const onCreateQuestionChildCommentSubmit = () => createQuestionChildComment({
        questionId: questionId!,
        questionCommentId: questionCommentId!,
        data: {
            content: childComment
        }
    });

    // 에디터 크기 조절
    useEffect(() => {
        const div = divRef.current;
        if (div) {
            // ResizeObserver 인스턴스 생성
            const resizeObserver = new ResizeObserver(entries => {
                const {width} = entries[0].contentRect;
                setWidth(width - 100);
            });

            // 관찰 시작
            resizeObserver.observe(div);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => resizeObserver.unobserve(div);
        }
    }, []);

    return (
        <Dialog open={modalState[ModalTypes.QUESTION_CHILD_COMMENT_CREATE].isVisible}>
            <DialogContent
                ref={divRef}
                style={{width}}
                className="flex flex-col min-w-[80%] lg:min-w-[60%] rounded-lg z-50 outline-0 px-3 py-5 sm:p-6">

                <div className="space-y-5">
                    <DialogHeader className="flex justify-center items-center">
                        <DialogTitle>답글 남기기</DialogTitle>
                    </DialogHeader>

                    <div
                        className="h-[700px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                        <CustomMonacoEditor
                            key={questionId}
                            width={`${100}%`}
                            height={`${100}%`}
                            language="markdown"
                            theme={theme === "light" ? "vs" : "vs-dark"}
                            value={childComment}
                            onChange={(value) => {
                                setChildComment(value)
                            }}
                            className=""
                        />
                    </div>

                    <DialogFooter className="flex flex-row justify-center sm:justify-center space-x-1">
                        <Button
                            onClick={() => {
                                if (!childComment) {
                                    toast.warn("내용을 입력하세요.", {
                                        position: "bottom-right",
                                        theme: theme,
                                        transition: Bounce,
                                    });
                                    return
                                }

                                if (childComment) {
                                    onCreateQuestionChildCommentSubmit()
                                }
                            }}
                            type="button"
                            className="rounded"
                        >
                            저장
                        </Button>

                        <DialogClose>
                            <Button
                                onClick={() => {
                                    setChildComment("")
                                    closeModal({
                                        name: ModalTypes.QUESTION_CHILD_COMMENT_CREATE
                                    });
                                }}
                                className="rounded hover:bg-secondary-hover"
                                type="button"
                                variant="secondary"
                            >
                                닫기
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default QuestionCreateChildCommentModal