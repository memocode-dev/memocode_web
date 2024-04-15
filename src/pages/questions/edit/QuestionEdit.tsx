import React, {useContext, useEffect, useState} from "react";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {Controller, useForm} from "react-hook-form";
import {Badge} from "@/components/ui/badge.tsx";
import {IoMdCloseCircle} from "react-icons/io";
import {toast} from "react-toastify";
import {QuestionUpdateForm} from "@/openapi/question/model";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import QuestionCreateCancel from "@/components/questions/QuestionCreateCancel.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useFindQuestion, useUpdateQuestion} from "@/openapi/question/api/questions/questions.ts";

const QuestionEdit = () => {

    const {theme} = useContext(ThemeContext)
    const {openModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const {questionId} = useParams()

    const editQuestionForm = useForm<QuestionUpdateForm>({
        defaultValues: {
            title: "",
            content: "",
            tags: []
        }
    });

    const [inputValue, setInputValue] = useState("")

    const {data: question} = useFindQuestion(questionId!, {
        query: {
            queryKey: ['Question', questionId!],
        }
    });

    const {mutate: updateQuestion} = useUpdateQuestion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 질문이 수정되었습니다.")
                navigate(`/questions/${questionId}`)
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const handleCreateQuestionSubmit = (data: QuestionUpdateForm) => {
        if (!data.title) {
            toast.warn("제목을 입력하세요.")
            return
        }

        if (!data.content) {
            toast.warn("내용을 입력하세요.")
            return
        }

        if (data.title && data.content) {
            onUpdateQuestionSubmit(data)
        }
    }

    const onUpdateQuestionSubmit = (data: QuestionUpdateForm) => updateQuestion({
        questionId: questionId!,
        data: data,
    });

    useEffect(() => {
        if (question) {
            editQuestionForm.reset(
                {
                    title: question?.title,
                    content: question?.content,
                    tags: question?.tags
                }
            )
        }
    }, [question]);

    return (
        <div
            className="flex flex-1 flex-col mt-14 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">
            <div className="bg-background flex flex-1 flex-col">

                {/* 질문 수정 */}
                <form
                    onSubmit={editQuestionForm.handleSubmit(handleCreateQuestionSubmit)}
                    className="flex flex-col flex-1 my-3 space-y-3">
                    {/* 제목 */}
                    <textarea
                        {...editQuestionForm.register("title")}
                        placeholder="제목을 작성해주세요"
                        className="bg-transparent h-16 text-2xl sm:text-4xl sm:px-3 py-3 placeholder-gray-400 focus:outline-none resize-none"
                    />

                    {/* 태그 */}
                    <div className="space-y-3 py-5">
                        <Controller
                            control={editQuestionForm.control}
                            name="tags"
                            render={({field: {onChange, value}}) => (
                                <>
                                    <input
                                        className="bg-transparent w-full h-10 text-lg sm:text-2xl sm:px-3 placeholder-gray-400 focus:outline-none"
                                        type="text"
                                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                // 중복 태그를 방지하기 위한 체크
                                                if (value?.map(tag => tag).includes(inputValue.toLowerCase())) {
                                                    toast.error("태그가 이미 존재합니다.")
                                                    return;
                                                }

                                                // 태그 10개 제한
                                                if (value?.length === 10) {
                                                    toast.error("태그는 최대 10개까지 가능합니다.")
                                                    return;
                                                }

                                                // 새 태그를 추가한 후 입력값을 초기화합니다.
                                                onChange([...value || [], inputValue.trim()])
                                                setInputValue("")
                                            }
                                        }}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="태그를 입력해주세요 (10개까지 입력 가능)"
                                    />
                                    <div className="flex flex-wrap sm:px-3">
                                        {value?.map((tag, index) => (
                                            <Badge key={index}
                                                   className="flex pl-3 pr-2 space-x-2 text-sm text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1 mb-1 cursor-default">
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
                            className="flex w-28 h-12 bg-primary hover:bg-primary-hover rounded p-2 justify-center items-center"
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

            <QuestionCreateCancel/>
        </div>
    )
}

export default QuestionEdit