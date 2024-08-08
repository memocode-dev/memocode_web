import MyBlogPage from "@/components/pages/myBlog/MyBlogPage";
import {Metadata} from "next";
import SeoHead from "@/components/common/SeoHead";
import React from "react";

interface MyBlogProps {
    params: {
        ascii_annotation_username: string;
    };
}

export async function generateMetadata({params}: MyBlogProps): Promise<Metadata> {

    const {ascii_annotation_username} = params; // %40dbflarla4966
    const username = ascii_annotation_username.replace("%40", "") // dbflarla4966

    return {
        title: `MEMOCODE | ${username}`,
        description: `${username}님의 블로그를 구경해보세요!`,
        keywords: [`${username}`, 'MEMOCODE', '메모코드', 'memocode'],
        openGraph: {
            type: 'article',
            url: `https://memocode.dev/@${username}`,
            siteName: 'MEMOCODE - 메모코드',
            title: `MEMOCODE | ${username}`,
            description: `링크를 눌러 ${username}님의 블로그를 구경해보세요!`,
            locale: 'ko_KR',
            images: [
                {
                    url: 'https://memocode.dev/memocode_png.png', // 프로필사진없으면 기본사진으로 구현하기
                    width: 800,
                    height: 600,
                    alt: `${username}` ? `${username}_image` : 'myBlog_image',
                },
            ],
        },
        alternates: {
            canonical: `https://memocode.dev/@${username}`,
            languages: {
                'ko-KR': `https://memocode.dev/@${username}`
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

const MyBlog = async ({params}: MyBlogProps) => {

    const {ascii_annotation_username} = params; // %40dbflarla4966
    const username = ascii_annotation_username.replace("%40", "") // dbflarla4966

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'article',
        'name': `MEMOCODE | ${username}`,
        'description': `링크를 눌러 ${username}님의 블로그를 구경해보세요!`,
        'url': `https://memocode.dev/@${username}`,
        'image': {
            '@type': `articleImage_${username}`,
            'url': 'https://memocode.dev/memocode_png.png',  // 프로필사진없으면 기본사진으로 구현하기
            'width': 800,
            'height': 600,
            'alt': `${username}` ? `${username}_image` : 'myBlog_image',
        },
        'keywords': `${username}, MEMOCODE, 메모코드, memocode`
    };

    return (
        <>
            <SeoHead
                keywords={jsonLd.keywords}
                title={jsonLd.name}
                description={`${username}님의 블로그를 구경해보세요!`}
                ogTitle={jsonLd.name}
                ogDescription={jsonLd.description}
                ogType="article"
                ogUrl={jsonLd.url}
                ogImage={jsonLd.image.url}
                ogImageAlt={jsonLd.image.alt}
                jsonLd={jsonLd}
            />

            <div className="flex-1 flex flex-col py-20 mx-3 sm:mx-[50px] lg:mx-[150px] xl:mx-[220px] 2xl:mx-[350px]">
                <MyBlogPage/>
            </div>
        </>
    )
}

export default MyBlog;