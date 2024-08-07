import {findMemo} from "@/openapi/api/memos/memos";
import {Button} from "@/components/ui/button";
import UpToDownButton from "@/components/ui/UpToDownButton";
import React from "react";
import MemoPage from "@/components/pages/memo/MemoPage";
import ErrorPage from "@/components/pages/error/ErrorPage";
import MarkdownView from "@/components/ui/MarkdownView";
import {Metadata} from "next";
import {getSeoMetadata} from "@/components/utils/SeoMetadata";
import Head from "next/head";

interface MemoProps {
    params: {
        memoId: string;
    };
}


export async function generateMetadata({params}: MemoProps): Promise<Metadata> {
    const {memoId} = params;
    const memo = await findMemo(memoId);

    return {
        title: `${memo.title}` ?? 'MEMOCODE | 메모',
        description: `${memo.summary}` ?? `${memo.user?.username}님의 메모를 확인해보세요!`,
        keywords: ["MEMOCODE", "메모코드"],
        openGraph: {
            type: 'article',
            url: `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
            siteName: `${memo.title}` ?? 'MEMOCODE | 메모',
            title: `${memo.title}` ?? 'MEMOCODE | 메모',
            description: `${memo.summary}` ?? `${memo.user?.username}님의 메모를 확인해보세요!`,
            locale: 'ko_KR',
            images: [
                {
                    url: `${memo.thumbnailUrl}` ?? 'https://memocode.dev/memocode_png.png',
                    width: 800,
                    height: 600,
                    alt: `${memo.title}` ? `${memo.title}Image` : 'memoImage',
                },
            ],
        },
        alternates: {
            canonical: `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
            languages: {
                'ko-KR': `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`
            },
        },
        icons: {
            icon: [
                {url: 'https://memocode.dev/favicon.ico', type: 'image/x-icon'},
            ]
        }
    }
    // return getSeoMetadata({
    //     // title: memo.title ?? 'MEMOCODE | 메모',
    //     // description: memo.summary ?? `${memo.user?.username}님의 메모를 확인해보세요!`,
    //     // keywords: memo.tags ?? ["MEMOCODE", "메모코드", `${memo.title}`],
    //     // ogUrl: `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
    //     // ogTitle: memo.title ?? 'MEMOCODE | 메모',
    //     // ogDescription: memo.summary ?? `${memo.user?.username}님의 메모를 확인해보세요!`,
    //     // ogImage: memo.thumbnailUrl ?? 'https://memocode.dev/memocode_png.png',
    //     // canonicalUrl: `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
    //     // alternateUrl: `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
    //     // hrefLang: 'ko_KR',
    //     title: 'MEMOCODE | 상세',
    //     description: '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    //     keywords: ["MEMOCODE", "메모코드"],
    //     ogUrl: 'https://memocode.dev',
    //     ogTitle: 'MEMOCODE - 상세',
    //     ogDescription: '메모와 블로그 관리를 한번에! 메모코드에서 나만의 개발 이야기를 적어보세요.',
    //     ogImage: 'https://memocode.dev/memocode_png.png',
    //     canonicalUrl: 'https://memocode.dev',
    //     alternateUrl: 'https://memocode.dev',
    //     hrefLang: 'ko_KR',
    // });
}

const Memo = async ({params}: MemoProps) => {

    const {memoId} = params;

    try {
        const memo = await findMemo(memoId);
        const markedMemoContent = MarkdownView.render(memo.content!);

        const jsonLd = {
            // '@context': 'https://schema.org',
            // '@type': 'WebPage',
            // 'name': memo.title ?? 'MEMOCODE | 메모',
            // 'description': memo.summary ?? `${memo.user?.username}님의 메모를 확인해보세요!`,
            // 'url': `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
            // 'image': {
            //     '@type': 'ImageObject',
            //     'url': memo.thumbnailUrl ?? 'https://memocode.dev/memocode_png.png',
            //     'width': 800,
            //     'height': 600,
            // },
            '@context': 'https://schema.org',
            '@type': 'article',
            'name': `${memo.title}` ?? 'MEMOCODE | 메모',
            'description': `${memo.summary}` ?? `${memo.user?.username}님의 메모를 확인해보세요!`,
            'url': `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
            'image': {
                '@type': `articleImage${memo.id}`,
                'url': `${memo.thumbnailUrl}` ?? 'https://memocode.dev/memocode_png.png',
                'width': 800,
                'height': 600,
            },
        };

        return (
            <>
                <Head>
                    <meta name="robots" content="all"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <meta charSet="utf-8"/>
                    <meta property="title" content={`${memo.title}` ?? 'MEMOCODE | 메모'}/>
                    <meta property="description" content={`${memo.summary}` ?? `${memo.user?.username}님의 메모를 확인해보세요!`}/>

                    <meta property="og:title" content={`${memo.title}` ?? 'MEMOCODE | 메모'}/>
                    <meta property="og:description"
                          content={`${memo.summary}` ?? `${memo.user?.username}님의 메모를 확인해보세요!`}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:url" content={`https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`}/>
                    <meta property="og:site_name" content={`${memo.title}` ?? 'MEMOCODE | 메모'}/>
                    <meta property="og:locale" content="ko_KR"/>
                    <meta property="og:image"
                          content={`${memo.thumbnailUrl}` ?? 'https://memocode.dev/memocode_png.png'}/>
                    <meta property="og:image:width" content="800"/>
                    <meta property="og:image:height" content="600"/>
                    <meta property="og:image:alt" content={`${memo.title}` ? `${memo.title}Image` : 'memoImage'}/>

                    {/* 웹사이트 소개 정보 구조화 */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
                    />
                </Head>

                <div
                    className="flex flex-1 pt-32 pb-24 md:pb-14 bg-background mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[200px] 2xl:mx-[350px]">
                    <MemoPage memo={memo} markedMemoContent={markedMemoContent}/>

                    {/* 위로 이동 버튼 */}
                    <Button variant="ghost"
                            className="hidden md:flex flex-1 fixed bottom-2.5 right-2.5 w-fit h-fit px-1.5 py-1.5 hover:bg-transparent border-2 border-transparent hover:border-primary">
                        <UpToDownButton direction="up"/>
                    </Button>
                </div>
            </>

        )

    } catch (error) {
        console.error("error : ", error);
        return <ErrorPage/>;
    }

};

export default Memo;