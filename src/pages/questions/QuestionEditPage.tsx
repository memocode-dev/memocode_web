import {useContext, useEffect, useState} from "react";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {Controller, useForm} from "react-hook-form";
import {Badge} from "@/components/ui/badge.tsx";
import {IoMdCloseCircle} from "react-icons/io";
import {Bounce, toast} from "react-toastify";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {UpdateQuestionForm} from "@/openapi/model";
import {useFindQuestion, useUpdateQuestion} from "@/openapi/api/questions/questions.ts";
import QuestionCreateAndEditPage__QuestionWriteCancelModal
    from "@/page_components/question_create_and_edit_page/QuestionCreateAndEditPage__QuestionWriteCancelModal.tsx";
import CustomMonacoEditorPreview from "@/components/common/CustomMonacoEditorPreview.tsx";

const QuestionEditPage = () => {

    const {theme} = useContext(ThemeContext)
    const {openModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const {questionId} = useParams()

    const editQuestionForm = useForm<UpdateQuestionForm>({
        defaultValues: {
            title: "",
            content: "",
            tags: []
        }
    });

    const [inputValue, setInputValue] = useState("")
    const [isComposing, setIsComposing] = useState(false); // 한글 입력 중인지 여부

    const {data: question} = useFindQuestion(questionId!, {
        query: {
            queryKey: ['QuestionEditPage', questionId!],
        }
    });

    const {mutate: updateQuestion} = useUpdateQuestion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 질문이 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                navigate(`/questions/${questionId}`)
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

    const handleCreateQuestionSubmit = (data: UpdateQuestionForm) => {
        if (!data.title) {
            toast.warn("제목을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
            });
            return
        }

        if (!data.content) {
            toast.warn("내용을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
            });
            return
        }

        if (data.title && data.content) {
            onUpdateQuestionSubmit(data)
        }
    }

    const onUpdateQuestionSubmit = (data: UpdateQuestionForm) => updateQuestion({
        questionId: questionId!,
        data: data,
    });

    useEffect(() => {
        if (question) {
            editQuestionForm.reset(
                {
                    title: question?.title,
                    content: question?.content,
                    tags: question?.tags,
                }
            )
        }
    }, [question]);

    return (
        <>
            <div
                className="flex flex-1 flex-col pb-20 md:pb-0 mt-20 bg-background overflow-y-auto mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[200px] 2xl:mx-[350px]">
                <div className="bg-background flex flex-1 flex-col">

                    {/* 질문 수정 */}
                    <form
                        onSubmit={editQuestionForm.handleSubmit(handleCreateQuestionSubmit)}
                        className="flex flex-col flex-1 my-3 space-y-3">

                        {/* 제목 */}
                        <textarea
                            {...editQuestionForm.register("title")}
                            placeholder="제목을 작성해주세요"
                            className="bg-transparent h-16 text-xl sm:text-2xl sm:px-3 py-3 placeholder-gray-400 focus:outline-none resize-none"
                        />

                        {/* 태그 */}
                        <div className="space-y-3 py-5">
                            <Controller
                                control={editQuestionForm.control}
                                name="tags"
                                render={({field: {onChange, value}}) => (
                                    <>
                                        <input
                                            className="bg-transparent w-full h-10 text-lg sm:text-xl sm:px-3 placeholder-gray-400 focus:outline-none"
                                            type="text"
                                            placeholder="태그를 입력해주세요 (10개까지 입력 가능)"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onCompositionStart={() => setIsComposing(true)} // 한글 입력 시작
                                            onCompositionEnd={() => setIsComposing(false)} // 한글 입력 완료
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' && !isComposing) {
                                                    event.preventDefault();
                                                    if (value?.includes(inputValue.trim().toLowerCase())) {
                                                        toast.error("태그가 이미 존재합니다.", {
                                                            position: "bottom-right",
                                                            theme: theme,
                                                            transition: Bounce,
                                                        });
                                                        return;
                                                    }
                                                    if (value?.length === 10) {
                                                        toast.error("태그는 최대 10개까지 가능합니다.", {
                                                            position: "bottom-right",
                                                            theme: theme,
                                                            transition: Bounce,
                                                        });
                                                        return;
                                                    }
                                                    onChange([...value || [], inputValue.trim()]);
                                                    setInputValue("");
                                                }
                                            }}
                                        />
                                        <div className="flex flex-wrap sm:px-3">
                                            {value?.map((tag, index) => (
                                                <Badge key={index}
                                                       className="flex pl-3 pr-2 space-x-2 text-sm mr-1 mb-1 cursor-default">
                                                    <span>{tag}</span>
                                                    <IoMdCloseCircle className="w-4 h-4 cursor-pointer"
                                                                     onClick={() => onChange(value?.filter(t => t !== tag))}/>
                                                </Badge>
                                            ))}
                                        </div>
                                    </>
                                )}
                            />
                        </div>

                        {/* 내용 */}
                        <div
                            className="h-[580px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                            <Controller
                                control={editQuestionForm.control}
                                name="content"
                                render={({field: {onChange, value}}) => (
                                    <CustomMonacoEditor
                                        width={`${100}%`}
                                        height={`${100}%`}
                                        language="markdown"
                                        value={value}
                                        onChange={onChange}
                                        theme={theme === "light" ? "vs" : "vs-dark"}
                                        className="question_comment_css"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-1 justify-center space-x-3 pt-2">
                            <Button
                                className="flex w-28 h-12 rounded p-2 justify-center items-center"
                                type="submit"
                            >
                                <span className="text-[16px]">등록</span>
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                className="flex w-28 h-12 hover:bg-secondary-hover rounded p-2 justify-center items-center"
                                onClick={() => {
                                    if (!editQuestionForm.getValues("content")) {
                                        navigate(`/questions/${questionId}`)
                                    }

                                    if (editQuestionForm.getValues("content")) {
                                        openModal({
                                            name: ModalTypes.QUESTION_CREATE_CANCEL
                                        })
                                    }
                                }}
                            >
                                <span className="text-[16px]">취소</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <CustomMonacoEditorPreview/>
            <QuestionCreateAndEditPage__QuestionWriteCancelModal/>
        </>
    )
}

export default QuestionEditPage