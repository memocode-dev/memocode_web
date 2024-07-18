import QuestionPage from "@/pages/question/QuestionPage";
import {findQuestion} from "@/openapi/api/questions/questions";
import ErrorPage from "@/pages/error/ErrorPage";
import React from "react";

interface QuestionProps {
    params: {
        questionId: string;
    };
}

const Question = async ({params}: QuestionProps) => {

    const {questionId} = params;

    try {
        const searchQuestion = await findQuestion(questionId);

        return <QuestionPage searchQuestion={searchQuestion}/>;
    } catch (error) {
        console.error("error", error);
        return <ErrorPage/>;
    }
}

export default Question;