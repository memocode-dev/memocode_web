import QuestionTitle from "@/components/questions/question/QuestionTitle.tsx";
import QuestionContent from "@/components/questions/question/QuestionContent.tsx";
import QuestionComment from "@/components/questions/question/QuestionComment.tsx";
import QuestionAnswer from "@/components/questions/question/QuestionAnswer.tsx";

const Question = () => {
    return (
        <div className="bg-transparent flex flex-1 flex-col py-3">
            <div className="flex-1 w-full">
                <QuestionTitle/>

                <QuestionContent/>

                <QuestionComment/>

                <QuestionAnswer/>
            </div>
        </div>
    )
}

export default Question