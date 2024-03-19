import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";
import MemoSummary from "@/components/memos/sidebar/MemoSummary.tsx";

type totalListProps = {
    isTab: string;
}

const Memos = ({isTab}: totalListProps) => {

    const {
        onMemoCreateSubmit,
        findAllMemo,
    } = useContext(MemoContext);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab1" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 p-1">
                <div
                    className={`flex flex-col space-y-1`}
                    id="tab1">

                    {findAllMemo.data?.data?.length !== 0 ?
                        findAllMemo.data?.data?.map((memo) => {
                            return <MemoSummary key={memo.id} memo={memo}/>
                        })
                        :
                        <button
                            onClick={onMemoCreateSubmit}
                            className="mx-2 my-1 hover:bg-gray-200 pl-1 py-2 rounded"
                        >
                            새 메모 시작하기
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Memos