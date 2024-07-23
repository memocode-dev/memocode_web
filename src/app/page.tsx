import React from 'react';
import {searchMemoByKeyword} from "@/openapi/api/memos/memos";
import MemosPage from "@/components/pages/memos/MemosPage";
import ErrorPage from "@/components/pages/error/ErrorPage";

export default async function Memos() {
    try {
        const searchAllMemos = await searchMemoByKeyword();

        return <MemosPage searchAllMemos={searchAllMemos}/>;

    } catch (error) {
        console.error("error : ", error);
        return <ErrorPage/>;
    }
}