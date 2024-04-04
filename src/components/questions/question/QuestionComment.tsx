import {useParams} from "react-router-dom";
import {useContext} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useForm} from "react-hook-form";
import CustomMonacoEditor from "@/components/common/CustomMonacoEditor.tsx";
import {Button} from "@/components/ui/button.tsx";

const QuestionComment = () => {

    const {questionId} = useParams()
    const {theme} = useContext(ThemeContext);
    const {setValue, watch} = useForm({
        defaultValues: {
            answer: ""
        }
    })

    return (
        <div className="flex flex-1 bg-background py-10">
            <div className="flex-1">
                <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300">답변하기</div>

                <div className="flex-1">
                    <CustomMonacoEditor
                        key={questionId}
                        width={`${100}%`}
                        height={`${490}px`}
                        language="markdown"
                        theme={theme === "light" ? "vs" : "vs-dark"}
                        onChange={(value) => setValue("answer", value)}
                        value={watch("answer")}
                        className="question_comment_css"
                    />
                </div>

                <div className="flex flex-1 justify-end">
                    <Button
                        className="flex w-16 h-12 bg-primary hover:bg-primary-hover rounded p-2 justify-center items-center mt-2">
                        <div>등록</div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default QuestionComment