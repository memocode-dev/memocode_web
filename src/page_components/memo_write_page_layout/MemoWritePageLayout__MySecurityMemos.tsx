import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";
import MemoWritePageLayout__MemoSummaryModal
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__modals/MemoWritePageLayout__MemoSummaryModal.tsx";

interface SecurityListProps {
    isTab: string;
}

const MemoWritePageLayout__MySecurityMemos = ({isTab}: SecurityListProps) => {

    const {findAllMyMemo} = useContext(MemoContext);

    const securityMemos = findAllMyMemo?.data?.filter(memo => memo.security);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab3" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 p-1">

                <div
                    className={`flex flex-col space-y-1`}
                    id="tab3">
                    {securityMemos?.map((securityMemo) => {
                        return <MemoWritePageLayout__MemoSummaryModal key={securityMemo.id} memo={securityMemo}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default MemoWritePageLayout__MySecurityMemos