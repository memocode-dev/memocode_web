import {TbSquareNumber1, TbSquareNumber2, TbSquareNumber3, TbSquareNumber4} from "react-icons/tb";
import React, {useContext, useState} from "react";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {Controller, useForm} from "react-hook-form";
import {FaBookReader} from "react-icons/fa";
import {Badge} from "@/components/ui/badge.tsx";
import {IoMdCloseCircle} from "react-icons/io";
import {toast} from "react-toastify";
import {useCreateQuestion} from "@/openapi/question/api/questions/questions.ts";
import {QuestionCreateForm} from "@/openapi/question/model";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import QuestionCreateCancel from "@/components/questions/QuestionCreateCancel.tsx";
import {useNavigate} from "react-router-dom";

const QuestionCreate = () => {

    const {theme} = useContext(ThemeContext)
    const {openModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const createQuestionForm = useForm<QuestionCreateForm>({
        defaultValues: {
            title: "",
            content: "",
            tags: []
        }
    });

    const [inputValue, setInputValue] = useState("")

    const {mutate: createQuestion} = useCreateQuestion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 질문이 등록되었습니다.")
                console.log("질문 생성 성공 후 questionId response로 받아야함")
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const handleCreateQuestionSubmit = (data: QuestionCreateForm) => {
        if (!data.title) {
            toast.warn("제목을 입력하세요.")
            return
        }

        if (!data.content) {
            toast.warn("내용을 입력하세요.")
            return
        }

        if (data.title && data.content) {
            onCreateQuestionSubmit(data)
        }
    }

    const onCreateQuestionSubmit = (data: QuestionCreateForm) => createQuestion({
        data: data,
    });

    return (
        <>
            <div className="bg-background flex flex-1 flex-col py-10">
                {/* 질문 전 참고사항 */}
                <div
                    className="flex flex-col bg-transparent cursor-default space-y-2">
                    <div className="flex items-center space-x-2">
                        <FaBookReader className="min-w-5 min-h-5"/>
                        <span className="text-lg sm:text-xl font-bold">질문하기 전! 읽어주세요</span>
                    </div>
                    <span className="text-[13px] sm:text-[15px] text-gray-500 dark:text-gray-400 space-y-1">
                    <div className="flex items-center space-x-1">
                        <TbSquareNumber1 className="min-w-5 min-h-5"/>
                        <span className="font-semibold">제목은 질문할 내용의 핵심을 담아 간단하게 작성해보세요.</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <TbSquareNumber2 className="min-w-5 min-h-5"/>
                        <span className="font-semibold">질문과 관련된 구체적인 태그는 원하는 답변을 얻을 수 있도록 도와줍니다.</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <TbSquareNumber3 className="min-w-5 min-h-5"/>
                        <span className="font-semibold">문제 상황, 이를 해결하기 위해 시도한 방법, 얻은 결과를 내용에 담아 질문해보세요.</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <TbSquareNumber4 className="min-w-5 min-h-5"/>
                        <span className="font-semibold">질문 등록 전 내용을 한번 더 검토 후 올려주세요.</span>
                    </div>
                </span>
                </div>

                {/* 질문 작성 */}
                <form onSubmit={createQuestionForm.handleSubmit(handleCreateQuestionSubmit)}
                      className="flex flex-col flex-1 my-5 space-y-3">
                    {/* 제목 */}
                    <textarea
                        {...createQuestionForm.register("title")}
                        placeholder="제목을 작성해주세요"
                        className="bg-transparent h-16 text-2xl sm:text-4xl sm:px-3 py-3 placeholder-gray-400 focus:outline-none resize-none"
                    />

                    {/* 태그 */}
                    <div className="space-y-3 py-5">
                        <Controller
                            control={createQuestionForm.control}
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
                        className="h-[450px] pt-14 pb-5 pl-5 border border-gray-200 dark:border-neutral-600 rounded-lg relative">
                        <Controller
                            control={createQuestionForm.control}
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
                                if (!createQuestionForm.getValues("content")) {
                                    navigate("/questions")
                                }

                                if (createQuestionForm.getValues("content")) {
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
        </>
    )
}

export default QuestionCreate