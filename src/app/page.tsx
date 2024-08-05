import React from 'react';
import {prefetchSearchMemoByKeywordInfinite} from "@/openapi/api/memos/memos";
import MemosPage from "@/components/pages/memos/MemosPage";
import ErrorPage from "@/components/pages/error/ErrorPage";
import {QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";

export default async function Memos() {
    try {
        const queryClient = await prefetchSearchMemoByKeywordInfinite(new QueryClient(), {pageSize: 20}, {
            query: {
                queryKey: ['MemosPage'],
                getNextPageParam: (lastPage) => {
                    return lastPage.last ? undefined : lastPage.page! + 1;
                },
            },
        });

        const dehydratedState = dehydrate(queryClient);

        return (
            <HydrationBoundary state={dehydratedState}><MemosPage/></HydrationBoundary>
        )

    } catch (error) {
        console.error("서버사이드 error:", error);
        return <ErrorPage/>;
    }
}