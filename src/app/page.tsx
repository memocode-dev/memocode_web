import React from 'react';
import {prefetchSearchMemoByKeywordInfinite} from "@/openapi/api/memos/memos";
import MemosPage from "@/components/pages/memos/MemosPage";
import ErrorPage from "@/components/pages/error/ErrorPage";
import {QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";
import {Metadata} from "next";
import {getSeoMetadata} from "@/components/utils/SeoMetadata";
import Head from "next/head";

export const metadata: Metadata = getSeoMetadata({
    title: 'MEMOCODE',
    description: '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    keywords: ["MEMOCODE", "메모코드"],
    ogUrl: 'https://memocode.dev',
    ogTitle: 'MEMOCODE - 메모코드',
    ogDescription: '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    ogImage: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
    canonicalUrl: 'https://memocode.dev',
    alternateUrl: 'https://memocode.dev',
    hrefLang: 'ko_KR',
});

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'MEMOCODE',
    'description': '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    'url': 'https://memocode.dev/',
    'image': {
        '@type': 'ImageObject',
        'url': 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
        'width': 800,
        'height': 600,
    },
};

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
            <>
                <Head>
                    <meta name="robots" content="all"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <meta charSet="utf-8"/>
                    {/*/!*<link rel="apple-touch-icon" href="아이콘 url"/>*!/ 애플기기에서 보이는 아이콘*/}
                    {/*<link rel="manifest" href="manifest url"/> 정보를 제공하는 JSON 텍스트 파일입니다. 이 파일을 다운로드하여 사이트를 기본 앱으로 표시하는 데 사용*/}

                    {/* 웹사이트 소개 정보 구조화 */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
                    />
                </Head>

                <HydrationBoundary state={dehydratedState}><MemosPage/></HydrationBoundary>
            </>
        )

    } catch (error) {
        console.error("서버사이드 error:", error);
        return <ErrorPage/>;
    }
}