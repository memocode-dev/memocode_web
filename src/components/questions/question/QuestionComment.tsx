import {useParams} from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useForm} from "react-hook-form";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";

const QuestionComment = () => {

    const {questionId} = useParams()
    const {theme} = useContext(ThemeContext);
    const {setValue, watch} = useForm({
        defaultValues: {
            answer: ""
        }
    })
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const div = divRef.current;
        if (div) {
            // ResizeObserver 인스턴스 생성
            const resizeObserver = new ResizeObserver(entries => {
                const { width} = entries[0].contentRect;
                setWidth(width - 5);
            });

            // 관찰 시작
            resizeObserver.observe(div);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => resizeObserver.unobserve(div);
        }
    }, []);

    return (
        <div className="flex flex-1 bg-white dark:bg-[#1E1E1E]">
            <div className="flex-1 py-10 px-5">
                <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300">답변하기</div>

                <div ref={divRef} className="flex flex-1">
                    <div className="flex w-full h-[490px]">
                        <CustomMonacoEditor
                            key={questionId}
                            width={`${width}%`}
                            height={`${100}%`}
                            language="markdown"
                            theme={theme === "light" ? "vs" : "vs-dark"}
                            onChange={(value) => setValue("answer", value)}
                            value={watch("answer")}
                            className="question_comment_css"
                        />
                    </div>
                </div>

                <div className="flex flex-1 justify-end">
                    <div
                        className="flex w-16 h-12 bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg p-2 justify-center items-center mt-2">
                        <div>등록</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionComment