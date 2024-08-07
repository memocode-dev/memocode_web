import React from 'react';
import {prefetchSearchMemoByKeywordInfinite} from "@/openapi/api/memos/memos";
import MemosPage from "@/components/pages/memos/MemosPage";
import ErrorPage from "@/components/pages/error/ErrorPage";
import {QueryClient, HydrationBoundary, dehydrate} from "@tanstack/react-query";
import {Metadata} from "next";
import SeoHead from "@/components/common/SeoHead";

export const metadata: Metadata = {
    title: 'MEMOCODE',
    description: '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    keywords: ["MEMOCODE", "메모코드"],
    openGraph: {
        type: 'website',
        url: `https://memocode.dev`,
        siteName: 'MEMOCODE - 메모코드',
        title: 'MEMOCODE - 메모코드',
        description: '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
        locale: 'ko_KR',
        images: [
            {
                url: 'https://memocode.dev/memocode_png.png',
                width: 800,
                height: 600,
                alt: 'memosImage',
            },
        ],
    },
    alternates: {
        canonical: `https://memocode.dev`,
        languages: {
            'ko-KR': `https://memocode.dev`
        },
    },
    icons: {
        icon: [
            {url: 'https://memocode.dev/favicon.ico', type: 'image/x-icon'},
        ]
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'website',
    'name': 'MEMOCODE - 메모코드',
    'description': '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    'url': 'https://memocode.dev/',
    'image': {
        '@type': 'websiteImage',
        'url': 'https://memocode.dev/memocode_png.png',
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
                <SeoHead
                    title="MEMOCODE"
                    description="메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요."
                    ogTitle="MEMOCODE"
                    ogDescription="메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요."
                    ogType="website"
                    ogUrl="https://memocode.dev"
                    ogImage="https://memocode.dev/memocode_png.png"
                    ogImageAlt="memos_image"
                    jsonLd={jsonLd}
                />

                <HydrationBoundary state={dehydratedState}><MemosPage/></HydrationBoundary>
            </>
        )

    } catch (error) {
        console.error("서버사이드 error:", error);
        return <ErrorPage/>;
    }
}