import QuestionTitle from "@/components/questions/question/QuestionTitle.tsx";
import QuestionContent from "@/components/questions/question/QuestionContent.tsx";
import QuestionComment from "@/components/questions/question/QuestionComment.tsx";
import QuestionAnswer from "@/components/questions/question/QuestionAnswer.tsx";

const Question = () => {
    return (
        <div className="
        flex flex-1 flex-col mt-14 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]
        py-3">
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