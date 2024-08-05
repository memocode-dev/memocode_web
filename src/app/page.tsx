import React from 'react';
import {prefetchSearchMemoByKeywordInfinite} from "@/openapi/api/memos/memos";
import MemosPage from "@/components/pages/memos/MemosPage";
import ErrorPage from "@/components/pages/error/ErrorPage";
import {QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";
import type {Metadata} from "next";
import {getSeoMetadata} from "@/components/utils/SeoMetadata";

export const metadata: Metadata = getSeoMetadata({
    title: 'MEMOCODE',
    description: '메모 작성과 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    url: 'https://memocode.dev',
    ogTitle: '메모코드 - MEMOCODE',
    ogDescription: '메모 작성과 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    ogImage: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
});

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