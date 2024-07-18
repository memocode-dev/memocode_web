import React from 'react';
import {searchMemoByKeyword} from "@/openapi/api/memos/memos";
import MemosPage from "@/pages/main/MemosPage";
import ErrorPage from "@/pages/error/ErrorPage";

export default async function Main() {
    try {
        const searchAllMemos = await searchMemoByKeyword();

        return <MemosPage searchAllMemos={searchAllMemos}/>;

    } catch (error) {
        console.error("error : ", error);
        return <ErrorPage/>;
    }
}