import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";
import MemoWritePageLayout__MemoSummaryModal from "@/page_components/memo_write_page_layout/memo_write_page_layout__modals/MemoWritePageLayout__MemoSummaryModal.tsx";

interface bookmarkListProps {
    isTab: string;
}

const MemoWritePageLayout__MyBookedMemos = ({isTab}: bookmarkListProps) => {

    const {findAllMyMemo} = useContext(MemoContext)

    const bookmarkedMemos = findAllMyMemo?.data?.filter(memo => memo.bookmarked);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab2" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 py-1">

                <div
                    className={`flex flex-col space-y-1`}
                    id="tab2">
                    {bookmarkedMemos?.map((bookmarkedMemo) => {
                        return <MemoWritePageLayout__MemoSummaryModal key={bookmarkedMemo.id} memo={bookmarkedMemo}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default MemoWritePageLayout__MyBookedMemos