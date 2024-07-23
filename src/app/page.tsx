import React from 'react';
import {searchMemoByKeyword} from "@/openapi/api/memos/memos";
import MemosPage from "@/pages/memos/MemosPage";
import ErrorPage from "@/pages/error/ErrorPage";

export default async function Memos() {
    try {
        const searchAllMemos = await searchMemoByKeyword();

        return <MemosPage searchAllMemos={searchAllMemos}/>;

    } catch (error) {
        console.error("error : ", error);
        return <ErrorPage/>;
    }
}