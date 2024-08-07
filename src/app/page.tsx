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
                alt: 'memos_image',
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
            { url: 'https://memocode.dev/favicon.ico', type: 'image/x-icon' },
            { url: 'https://memocode.dev/favicon_32x32.png', sizes: '32x32', type: 'image/png' },
            { url: 'https://memocode.dev/favicon_16x16.png', sizes: '16x16', type: 'image/png' },
            { url: 'https://memocode.dev/favicon_180x180.png', sizes: '180x180' },
            { url: 'https://memocode.dev/favicon_192x192.png', sizes: '192x192', type: 'image/png' },
            { url: 'https://memocode.dev/favicon_512x512.png', sizes: '512x512', type: 'image/png' }
        ]
    }
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'website',
    'name': 'MEMOCODE',
    'description': '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    'url': 'https://memocode.dev',
    'image': {
        '@type': 'websiteImage',
        'url': 'https://memocode.dev/memocode_png.png',
        'width': 800,
        'height': 600,
        'alt': 'memos_image',
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
                    title={jsonLd.name}
                    description={jsonLd.description}
                    ogTitle={jsonLd.name}
                    ogDescription={jsonLd.description}
                    ogType="website"
                    ogUrl={jsonLd.url}
                    ogImage={jsonLd.image.url}
                    ogImageAlt={jsonLd.image.alt}
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