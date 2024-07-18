'use client'

import {TbSquareNumber1, TbSquareNumber2, TbSquareNumber3, TbSquareNumber4} from "react-icons/tb";
import {useContext, useState} from "react";
import {Button} from "@/components/ui/button";
import {Controller, useForm} from "react-hook-form";
import {FaBookReader} from "react-icons/fa";
import {Badge} from "@/components/ui/badge";
import {IoMdCloseCircle} from "react-icons/io";
import {Bounce, toast} from "react-toastify";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {CreateQuestionForm} from "@/openapi/model";
import {useCreateQuestion} from "@/openapi/api/questions/questions";
import CustomMonacoEditorPreview from "@/components/common/CustomMonacoEditorPreview";
import {useTheme} from "@/context/ThemeContext";
import {useRouter} from "next/navigation";
import dynamic from 'next/dynamic';
import QuestionsSideBar from "@/components/page_components/questions/QuestionsSideBar";
import QuestionCreateCancelModal from "@/components/page_components/question/QuestionCreateCancelModal";

const CustomMonacoEditor = dynamic(() => import('@/components/common/CustomMonacoEditor'), {
    ssr: false
});

const QuestionCreatePage = () => {

    const {theme} = useTheme()
    const {openModal} = useContext(ModalContext)
    const router = useRouter()
    const [inputValue, setInputValue] = useState("")
    const [isComposing, setIsComposing] = useState(false); // 한글 입력 중인지 여부

    const {mutate: createQuestion} = useCreateQuestion({
        mutation: {
            onSuccess: async (questionId) => {
                toast.success("성공적으로 질문이 등록되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                typeof window !== 'undefined' && router.push(`/questions/${questionId}`)
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

    const createQuestionForm = useForm<CreateQuestionForm>({
        defaultValues: {
            title: "",
            content: "",
            tags: []
        }
    });

    const handleCreateQuestionSubmit = (data: CreateQuestionForm) => {
        if (!data.title) {
            toast.warn("제목을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
                className: "text-sm",
            });
            return
        }

        if (!data.content) {
            toast.warn("내용을 입력하세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
                className: "text-sm",
            });
            return
        }

        if (data.title && data.content) {
            onCreateQuestionSubmit(data)
        }
    }

    const onCreateQuestionSubmit = (data: CreateQuestionForm) => createQuestion({
        data: data,
    });

    const QuestionCautionNote = (
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
    )

    return (
        <>
            <div
                className="flex flex-1 flex-col py-20 bg-background mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">
                <QuestionsSideBar/>

                <div className="flex flex-col flex-1 py-5">
                    {/* 질문 전 참고사항 */}
                    {QuestionCautionNote}

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
                                                            className: "text-sm",
                                                        });
                                                        return;
                                                    }
                                                    if (value?.length === 10) {
                                                        toast.error("태그는 최대 10개까지 가능합니다.", {
                                                            position: "bottom-right",
                                                            theme: theme,
                                                            transition: Bounce,
                                                            className: "text-sm",
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

                        <div className="flex justify-center space-x-3 pt-2">

                            {/* 등록 버튼 */}
                            <Button
                                className="flex w-28 h-12 rounded p-2 justify-center items-center"
                                type="submit"
                            >
                                <span className="text-[16px]">등록</span>
                            </Button>

                            {/* 취소 버튼 */}
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex w-28 h-12 hover:bg-secondary-hover rounded p-2 justify-center items-center"
                                onClick={() => {
                                    if (!createQuestionForm.getValues("content")) {
                                        typeof window !== 'undefined' && router.push("/questions")
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

            </div>

            <CustomMonacoEditorPreview/>
            <QuestionCreateCancelModal/>
        </>
    )
}

export default QuestionCreatePage