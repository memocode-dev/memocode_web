import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext";
import MyMemoContextMenuModal from "@/page_components/myMemo/layout/MyMemoContextMenuModal";

type totalListProps = {
    isTab: string;
}

const MyPublicMemos = ({isTab}: totalListProps) => {

    const {findAllMyMemo} = useContext(MemoContext)
    const publicMemos = findAllMyMemo?.data?.filter(memo => memo.visibility);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab1" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 py-1">

                <div
                    className={`flex flex-col space-y-1`}
                    id="tab1">
                    {publicMemos?.map((publicMemo) => {
                        return <MyMemoContextMenuModal key={publicMemo.id} memo={publicMemo}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default MyPublicMemos;