import React from 'react';
import { searchMemoByKeyword } from "@/openapi/api/memos/memos";
import MemosPage from "@/components/pages/memos/MemosPage";
import ErrorPage from "@/components/pages/error/ErrorPage";

export default async function Memos() {
    try {
        const searchAllMemos = await searchMemoByKeyword();
        console.log("서버사이드 searchAllMemos:", searchAllMemos);

        return <MemosPage/>;
    } catch (error) {
        console.error("서버사이드 error:", error);
        return <ErrorPage />;
    }
}