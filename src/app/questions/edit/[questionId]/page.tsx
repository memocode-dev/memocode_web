import QuestionUpdatePage from "@/pages/question/QuestionUpdatePage";
import {findQuestion} from "@/openapi/api/questions/questions";
import ErrorPage from "@/pages/error/ErrorPage";
import React from "react";

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