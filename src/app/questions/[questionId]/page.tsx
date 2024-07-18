import {findQuestion} from "@/openapi/api/questions/questions";
import React from "react";
import QuestionPage from "@/components/pages/question/QuestionPage";
import ErrorPage from "@/components/pages/error/ErrorPage";

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