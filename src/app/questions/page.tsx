import {searchQuestionByKeyword} from "@/openapi/api/questions/questions";
import React from "react";
import QuestionsPage from "@/components/pages/questions/QuestionsPage";
import ErrorPage from "@/components/pages/error/ErrorPage";
import {Metadata} from "next";
import SeoHead from "@/components/common/SeoHead";

export const metadata: Metadata = {
    title: 'MEMOCODE | 질문 & 답변',
    description: '질문과 답변을 주고 받으며 관련 지식을 공유해보세요!',
    keywords: ["MEMOCODE", "메모코드", "질문", "답변", "개발", "IT"],
    openGraph: {
        type: 'article',
        url: `https://memocode.dev/questions`,
        siteName: 'MEMOCODE - 메모코드',
        title: 'MEMOCODE | 질문 & 답변',
        description: '질문과 답변을 주고 받으며 관련 지식을 공유해보세요!',
        locale: 'ko_KR',
        images: [
            {
                url: 'https://memocode.dev/memocode_png.png',
                width: 800,
                height: 600,
                alt: 'questionsImage',
            },
        ],
    },
    alternates: {
        canonical: `https://memocode.dev/questions`,
        languages: {
            'ko-KR': `https://memocode.dev/questions`
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
    '@type': 'article',
    'name': 'MEMOCODE | 질문 & 답변',
    'description': '질문과 답변을 주고 받으며 관련 지식을 공유해보세요!',
    'url': 'https://memocode.dev/questions',
    'image': {
        '@type': 'articleImage',
        'url': 'https://memocode.dev/memocode_png.png',
        'width': 800,
        'height': 600,
        'alt': 'questionsImage',
    },
};

export default async function Questions() {
    try {
        const searchAllQuestions = await searchQuestionByKeyword();

        return (
            <>
                <SeoHead
                    title={jsonLd.name}
                    description={jsonLd.description}
                    ogTitle={jsonLd.name}
                    ogDescription={jsonLd.description}
                    ogType="article"
                    ogUrl={jsonLd.url}
                    ogImage={jsonLd.image.url}
                    ogImageAlt={jsonLd.image.alt}
                    jsonLd={jsonLd}
                />

                <QuestionsPage searchAllQuestions={searchAllQuestions}/>;
            </>
        )

    } catch (error) {
        console.error("error : ", error);
        return <ErrorPage/>;
    }
}