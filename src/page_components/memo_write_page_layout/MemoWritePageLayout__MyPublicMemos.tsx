import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";
import MemoWritePageLayout__MemoSummaryModal from "@/page_components/memo_write_page_layout/memo_write_page_layout__modals/MemoWritePageLayout__MemoSummaryModal.tsx";

type totalListProps = {
    isTab: string;
}

const MemoWritePageLayout__MyPublicMemos = ({isTab}: totalListProps) => {

    const {findAllMyMemo} = useContext(MemoContext)
    const publicMemos = findAllMyMemo?.data?.filter(memo => memo.visibility);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab1" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 py-1">

                <div
                    className={`flex flex-col space-y-1`}
                    id="tab1">
                    {publicMemos?.map((publicMemo) => {
                        return <MemoWritePageLayout__MemoSummaryModal key={publicMemo.id} memo={publicMemo}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default MemoWritePageLayout__MyPublicMemos;