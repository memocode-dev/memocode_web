import {findQuestion} from "@/openapi/api/questions/questions";
import React from "react";
import QuestionPage from "@/components/pages/question/QuestionPage";
import {Metadata} from "next";
import SeoHead from "@/components/common/SeoHead";

interface QuestionProps {
    params: {
        questionId: string;
    };
}

export async function generateMetadata({params}: QuestionProps): Promise<Metadata> {

    const {questionId} = params;
    const question = await findQuestion(questionId);

    return {
        title: question.title ? question.title : 'MEMOCODE | 질문',
        description: question.content,
        keywords: question.tags ? question.tags : question.title?.split(' '),
        openGraph: {
            type: 'article',
            url: `https://memocode.dev/questions/${questionId}`,
            siteName: 'MEMOCODE - 메모코드',
            title: question.title ? question.title : 'MEMOCODE | 질문',
            description: question.content ? question.content : `링크를 눌러 질문을 확인해보세요!`,
            locale: 'ko_KR',
            images: [
                {
                    url: 'https://memocode.dev/favicon_500x500.png',
                    width: 800,
                    height: 600,
                    alt: `${question.id}` ? `${question.id}_image` : 'question_image',
                },
            ],
        },
        alternates: {
            canonical: `https://memocode.dev/questions/${questionId}`,
            languages: {
                'ko-KR': `https://memocode.dev/questions/${questionId}`
            },
        },
        icons: {
            icon: [
                {url: 'https://memocode.dev/favicon.ico', type: 'image/x-icon'},
                {url: 'https://memocode.dev/favicon_32x32.png', sizes: '32x32', type: 'image/png'},
                {url: 'https://memocode.dev/favicon_16x16.png', sizes: '16x16', type: 'image/png'},
                {url: 'https://memocode.dev/favicon_180x180.png', sizes: '180x180'},
                {url: 'https://memocode.dev/favicon_192x192.png', sizes: '192x192', type: 'image/png'},
                {url: 'https://memocode.dev/favicon_512x512.png', sizes: '512x512', type: 'image/png'}
            ]
        }
    }
}

const Question = async ({params}: QuestionProps) => {

    const {questionId} = params;
    const searchQuestion = await findQuestion(questionId);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'article',
        'name': searchQuestion.title ? searchQuestion.title : 'MEMOCODE | 질문',
        'description': searchQuestion.content ? searchQuestion.content : `링크를 눌러 질문을 확인해보세요!`,
        'url': `https://memocode.dev/questions/${questionId}`,
        'image': {
            '@type': `articleImage_${questionId}`,
            'url': 'https://memocode.dev/favicon_500x500.png',
            'width': 800,
            'height': 600,
            'alt': `${searchQuestion.id}` ? `${searchQuestion.id}_image` : 'memo_image',
        },
    };

    return (
        <>
            <SeoHead
                title={jsonLd.name}
                description={searchQuestion.content!}
                ogTitle={jsonLd.name}
                ogDescription={jsonLd.description}
                ogType="article"
                ogUrl={jsonLd.url}
                ogImage={jsonLd.image.url}
                ogImageAlt={jsonLd.image.alt}
                jsonLd={jsonLd}
            />

            <QuestionPage searchQuestion={searchQuestion}/>
        </>
    );
}

export default Question;