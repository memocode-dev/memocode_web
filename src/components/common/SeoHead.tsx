import Head from "next/head";
import React from "react";

interface SeoHeadProps {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogType: string;
    ogUrl: string;
    ogImage: string;
    ogImageAlt: string;
    jsonLd: {
        '@context': string;
        '@type': string;
        name: string;
        description: string;
        url: string;
        image: {
            '@type': string;
            url: string;
            width: number;
            height: number;
        };
    };
}

const SeoHead = ({
                     title,
                     description,
                     ogTitle,
                     ogDescription,
                     ogType,
                     ogUrl,
                     ogImage,
                     ogImageAlt,
                     jsonLd
                 }: SeoHeadProps) => {
    return (
        <Head>
            <meta name="robots" content="all"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <meta charSet="utf-8"/>

            <meta property="title" content={title}/>
            <meta property="description" content={description}/>

            <meta property="og:title" content={ogTitle}/>
            <meta property="og:description" content={ogDescription}/>
            <meta property="og:type" content={ogType}/>
            <meta property="og:url" content={ogUrl}/>
            <meta property="og:site_name" content="MEMOCODE - 메모코드"/>
            <meta property="og:locale" content="ko_KR"/>
            <meta property="og:image" content={ogImage}/>
            <meta property="og:image:width" content="800"/>
            <meta property="og:image:height" content="600"/>
            <meta property="og:image:alt" content={ogImageAlt}/>
            {/*/!*<link rel="apple-touch-icon" href="아이콘 url"/>*!/ 애플기기에서 보이는 아이콘*/}
            {/*<link rel="manifest" href="manifest url"/> 정보를 제공하는 JSON 텍스트 파일입니다. 이 파일을 다운로드하여 사이트를 기본 앱으로 표시하는 데 사용*/}

            {/* 웹사이트 소개 정보 구조화 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
        </Head>

    )
}

export default SeoHead;