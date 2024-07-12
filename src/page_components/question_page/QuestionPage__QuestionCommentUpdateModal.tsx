import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Controller, useForm} from "react-hook-form";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {
    UpdateQuestionCommentForm
} from "@/openapi/model";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {
    useFindAllQuestionComment,
    useUpdateQuestionComment
} from "@/openapi/api/questions-comments/questions-comments.ts";
import {Bounce, toast} from "react-toastify";

const QuestionPage__QuestionCommentUpdateModal = () => {

    const {theme} = useContext(ThemeContext)
    const {modalState, closeModal} = useContext(ModalContext)
    const {questionId, questionComment} = modalState[ModalTypes.QUESTION_COMMENT_UPDATE].data
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

    const {
        refetch: questionCommentsRefetch,
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionPage__QuestionComments', questionId]
        }
    });

    const {mutate: updateQuestionComment} = useUpdateQuestionComment({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 답변/답글이 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                await questionCommentsRefetch()
                closeModal({name: ModalTypes.QUESTION_COMMENT_UPDATE})
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

    const onUpdateQuestionCommentSubmit = (data: UpdateQuestionCommentForm) => updateQuestionComment({
        questionId: questionId!,
        questionCommentId: questionComment!.id!,
        data: data,
    });

    const handleUpdateQuestionSubmit = (data: UpdateQuestionCommentForm) => {

        if (!data.content) {
            toast.warn("내용을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
            });
            return
        }

        if (data.content) {
            onUpdateQuestionCommentSubmit(data)
        }
    }

    const updateQuestionCommentForm = useForm<UpdateQuestionCommentForm>({
        defaultValues: {
            content: ""
        }
    });

    useEffect(() => {
        if (questionComment) {
            updateQuestionCommentForm.reset(
                {
                    content: questionComment?.content
                }
            )
        }
    }, [questionComment]);

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
        <Dialog open={modalState[ModalTypes.QUESTION_COMMENT_UPDATE].isVisible}>
            <DialogContent
                ref={divRef}
                style={{width}}
                className="flex flex-col min-w-[80%] lg:min-w-[60%] rounded-lg z-50 outline-0 px-3 py-5 sm:p-6">

                <form className="space-y-5"
                      onSubmit={updateQuestionCommentForm.handleSubmit(handleUpdateQuestionSubmit)}>
                    <DialogHeader className="flex justify-center items-center">
                        <DialogTitle>답변 / 답글 수정</DialogTitle>
                    </DialogHeader>

                    <Controller
                        control={updateQuestionCommentForm.control}
                        name="content"
                        render={({field: {onChange, value}}) => (
                            <div
                                className="h-[700px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                                <CustomMonacoEditor
                                    width={`${100}%`}
                                    height={`${100}%`}
                                    language="markdown"
                                    value={value}
                                    onChange={onChange}
                                    theme={theme === "light" ? "vs" : "vs-dark"}
                                    className=""
                                />
                            </div>
                        )}
                    />

                    <DialogFooter className="flex flex-row justify-center sm:justify-center space-x-1">
                        <Button
                            type="submit"
                            className="rounded"
                        >
                            저장
                        </Button>

                        <DialogClose>
                            <Button
                                onClick={() => {
                                    closeModal({
                                        name: ModalTypes.QUESTION_COMMENT_UPDATE
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
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default QuestionPage__QuestionCommentUpdateModal
