import {searchQuestionByKeyword} from "@/openapi/api/questions/questions";
import React from "react";
import QuestionsPage from "@/components/pages/questions/QuestionsPage";
import ErrorPage from "@/components/pages/error/ErrorPage";

export default async function Questions() {
    try {
        const searchAllQuestions = await searchQuestionByKeyword();

        return <QuestionsPage searchAllQuestions={searchAllQuestions}/>;

    } catch (error) {
        console.error("error : ", error);
        return  <ErrorPage/>;
    }
}