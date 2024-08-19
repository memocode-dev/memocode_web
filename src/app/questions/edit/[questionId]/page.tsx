import {findQuestion} from "@/openapi/api/questions/questions";
import React from "react";
import QuestionUpdatePage from "@/components/pages/question/QuestionUpdatePage";
import ErrorPage from "@/components/pages/error/404";

interface QuestionUpdateProps {
    params: {
        questionId: string;
    };
}

const QuestionUpdate = async ({params}: QuestionUpdateProps) => {

    const {questionId} = params;

    try {
        const searchQuestion = await findQuestion(questionId);

        return <QuestionUpdatePage question={searchQuestion} questionId={questionId}/>;
    } catch (error) {
        console.error("error", error);
        return <ErrorPage/>;
    }
}

export default QuestionUpdate;