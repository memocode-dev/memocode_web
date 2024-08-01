import React from 'react';
import { searchMemoByKeyword } from "@/openapi/api/memos/memos";
import MemosPage from "@/components/pages/memos/MemosPage";
import ErrorPage from "@/components/pages/error/ErrorPage";

export default async function Memos() {
    try {
        const searchAllMemos = await searchMemoByKeyword();
        console.log("서버사이드 searchAllMemos:", searchAllMemos); // 서버에서 반환된 데이터 로그

        return <MemosPage searchAllMemos={searchAllMemos} />;
    } catch (error) {
        console.error("서버사이드 error:", error);
        return <ErrorPage />;
    }
}