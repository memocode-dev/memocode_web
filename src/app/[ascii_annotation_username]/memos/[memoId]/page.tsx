import {findMemo} from "@/openapi/api/memos/memos";
import {Button} from "@/components/ui/button";
import UpToDownButton from "@/components/ui/UpToDownButton";
import React from "react";
import MemoPage from "@/components/pages/memo/MemoPage";
import MarkdownView from "@/components/ui/MarkdownView";
import {Metadata} from "next";
import SeoHead from "@/components/common/SeoHead";
import NotFound from "@/app/not-found";

interface MemoProps {
    params: {
        memoId: string;
    };
}

export async function generateMetadata({params}: MemoProps): Promise<Metadata> {

    const {memoId} = params;
    const memo = await findMemo(memoId);

    return {
        title: memo.title ? memo.title : 'MEMOCODE | 메모',
        description: memo.summary ? memo.summary : memo.content,
        keywords: memo.tags ? memo.tags : memo.title?.split(' '),
        openGraph: {
            type: 'article',
            url: `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
            siteName: 'MEMOCODE - 메모코드',
            title: memo.title ? memo.title : 'MEMOCODE | 메모',
            description: memo.summary ? memo.summary : memo.content,
            locale: 'ko_KR',
            images: [
                {
                    url: memo.thumbnailUrl ? memo.thumbnailUrl : 'https://memocode.dev/favicon_500x500.png',
                    width: 800,
                    height: 600,
                    alt: `${memo.id}` ? `${memo.id}_image` : 'memo_image',
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
                {url: 'https://memocode.dev/favicon_32x32.png', sizes: '32x32', type: 'image/png'},
                {url: 'https://memocode.dev/favicon_16x16.png', sizes: '16x16', type: 'image/png'},
                {url: 'https://memocode.dev/favicon_180x180.png', sizes: '180x180'},
                {url: 'https://memocode.dev/favicon_192x192.png', sizes: '192x192', type: 'image/png'},
                {url: 'https://memocode.dev/favicon_512x512.png', sizes: '512x512', type: 'image/png'}
            ]
        }
    }
}

const Memo = async ({params}: MemoProps) => {

    const {memoId} = params;

    try {
        const memo = await findMemo(memoId);
        const markedMemoContent = MarkdownView.render(memo.content!);

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'article',
            'name': memo.title ? memo.title : 'MEMOCODE | 메모',
            'description': memo.summary ? memo.summary : `링크를 눌러 메모를 확인해보세요!`,
            'url': `https://memocode.dev/@${memo.user?.username}/memos/${memo.id}`,
            'image': {
                '@type': `articleImage_${memo.id}`,
                'url': memo.thumbnailUrl ? memo.thumbnailUrl : 'https://memocode.dev/favicon_500x500.png',
                'width': 800,
                'height': 600,
                'alt': `${memo.id}` ? `${memo.id}_image` : 'memo_image',
            },
        };

        return (
            <>
                <SeoHead
                    title={jsonLd.name}
                    description={memo.summary ? memo.summary : memo.content!}
                    ogTitle={jsonLd.name}
                    ogDescription={jsonLd.description}
                    ogType="article"
                    ogUrl={jsonLd.url}
                    ogImage={jsonLd.image.url}
                    ogImageAlt={jsonLd.image.alt}
                    jsonLd={jsonLd}
                />

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
    } catch {
        return <NotFound/>;
    }
};

export default Memo;