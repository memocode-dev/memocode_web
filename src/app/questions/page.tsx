import {searchQuestionByKeyword} from "@/openapi/api/questions/questions";
import QuestionsPage from "@/pages/questions/QuestionsPage";
import ErrorPage from "@/pages/error/ErrorPage";
import React from "react";

export default async function Questions() {
    try {
        const searchAllQuestions = await searchQuestionByKeyword();

        return <QuestionsPage searchAllQuestions={searchAllQuestions}/>;

    } catch (error) {
        console.error("error : ", error);
        return  <ErrorPage/>;
    }
}