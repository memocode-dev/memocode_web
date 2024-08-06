import {findMemo} from "@/openapi/api/memos/memos";
import {Button} from "@/components/ui/button";
import UpToDownButton from "@/components/ui/UpToDownButton";
import React from "react";
import MemoPage from "@/components/pages/memo/MemoPage";
import ErrorPage from "@/components/pages/error/ErrorPage";
import MarkdownView from "@/components/ui/MarkdownView";

interface MemoProps {
    params: {
        memoId: string;
    };
}

// export const metadata: Metadata = getSeoMetadata({
//     title: 'test',
//     description: 'test page description',
//     url: 'https://test.test/memos',
//     ogTitle: 'Memos Page',
//     ogDescription: 'Description of Memos Page',
//     ogImage: 'https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg',
// });

const Memo = async ({params}: MemoProps) => {

    const {memoId} = params;

    try {
        const memo = await findMemo(memoId);
        const markedMemoContent = MarkdownView.render(memo.content!);

        return (
            <div
                className="flex flex-1 pt-32 pb-24 md:pb-14 bg-background mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[200px] 2xl:mx-[350px]">
                <MemoPage memo={memo} markedMemoContent={markedMemoContent}/>

                {/* 위로 이동 버튼 */}
                <Button variant="ghost"
                        className="hidden md:flex flex-1 fixed bottom-2.5 right-2.5 w-fit h-fit px-1.5 py-1.5 hover:bg-transparent border-2 border-transparent hover:border-primary">
                    <UpToDownButton direction="up"/>
                </Button>
            </div>

        )

    } catch (error) {
        console.error("error : ", error);
        return <ErrorPage/>;
    }

};

export default Memo;