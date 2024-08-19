import {findQuestion} from "@/openapi/api/questions/questions";
import React from "react";
import QuestionUpdatePage from "@/components/pages/question/QuestionUpdatePage";

interface QuestionUpdateProps {
    params: {
        questionId: string;
    };
}

const QuestionUpdate = async ({params}: QuestionUpdateProps) => {

    const {questionId} = params;
    const searchQuestion = await findQuestion(questionId);

    return <QuestionUpdatePage question={searchQuestion} questionId={questionId}/>;
}

export default QuestionUpdate;