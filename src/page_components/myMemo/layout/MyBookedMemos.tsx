'use client';

import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext";
import MyMemoContextMenuModal from "@/page_components/myMemo/layout/MyMemoContextMenuModal";

interface bookmarkListProps {
    isTab: string;
}

const MyBookedMemos = ({isTab}: bookmarkListProps) => {

    const {findAllMyMemo} = useContext(MemoContext)
    const bookmarkedMemos = findAllMyMemo?.data?.filter(memo => memo.bookmarked);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab3" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 py-1">

                <div
                    className={`flex flex-col space-y-1`}
                    id="tab3">
                    {bookmarkedMemos?.map((bookmarkedMemo) => {
                        return <MyMemoContextMenuModal key={bookmarkedMemo.id} memo={bookmarkedMemo}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default MyBookedMemos