import {findMemo} from "@/openapi/api/memos/memos";
import {Button} from "@/components/ui/button";
import UpToDownButton from "@/components/ui/UpToDownButton";
import React from "react";
import MemoPage from "@/components/pages/memo/MemoPage";
import ErrorPage from "@/components/pages/error/ErrorPage";

interface MemoProps {
    params: {
        memoId: string;
    };
}

const Memo = async ({params}: MemoProps) => {

    try {
        const {memoId} = params;
        const searchMemo = await findMemo(memoId);

        return (
            <div
                className="flex flex-1 pt-32 pb-24 md:pb-14 bg-background mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[200px] 2xl:mx-[350px]">
                <MemoPage searchMemo={searchMemo}/>

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