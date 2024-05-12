import {TbSquareNumber1, TbSquareNumber2, TbSquareNumber3, TbSquareNumber4} from "react-icons/tb";
import {useContext, useState} from "react";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {Controller, useForm} from "react-hook-form";
import {FaBookReader} from "react-icons/fa";
import {Badge} from "@/components/ui/badge.tsx";
import {IoMdCloseCircle} from "react-icons/io";
import {toast} from "react-toastify";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useNavigate} from "react-router-dom";
import {CreateQuestionForm} from "@/openapi/model";
import {useCreateQuestion} from "@/openapi/api/questions/questions.ts";
import QuestionCreateAndEditPage__QuestionWriteCancelModal
    from "@/page_components/question_create_and_edit_page/QuestionCreateAndEditPage__QuestionWriteCancelModal.tsx";

const QuestionCreatePage = () => {

    const {theme} = useContext(ThemeContext)
    const {openModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const createQuestionForm = useForm<CreateQuestionForm>({
        defaultValues: {
            title: "",
            content: "",
            tags: []
        }
    });

    const [inputValue, setInputValue] = useState("")
    const [isComposing, setIsComposing] = useState(false); // 한글 입력 중인지 여부

    const {mutate: createQuestion} = useCreateQuestion({
        mutation: {
            onSuccess: async (questionId) => {
                toast.success("성공적으로 질문이 등록되었습니다.")
                navigate(`/questions/${questionId}`)
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const handleCreateQuestionSubmit = (data: CreateQuestionForm) => {
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

    const onCreateQuestionSubmit = (data: CreateQuestionForm) => createQuestion({
        data: data,
    });

    const QuestionCreatePage__QuestionCautionNote = (
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
            <div className="flex flex-1 flex-col mt-14 bg-background overflow-y-auto mx-3 sm:mx-[50px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px] py-10">

                {/* 질문 전 참고사항 */}
                {QuestionCreatePage__QuestionCautionNote}

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
                                                    toast.error("태그가 이미 존재합니다.");
                                                    return;
                                                }
                                                if (value?.length === 10) {
                                                    toast.error("태그는 최대 10개까지 가능합니다.");
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

                        {/* 등록 버튼 */}
                        <Button
                            className="flex w-28 h-12 bg-primary hover:bg-primary-hover rounded p-2 justify-center items-center"
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

            <QuestionCreateAndEditPage__QuestionWriteCancelModal/>
        </>
    )
}

export default QuestionCreatePage