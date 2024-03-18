import {Link} from "react-router-dom";
import MemoContextMenuWrapper from "@/components/memos/context_menu/MemoContextMenuWrapper.tsx";
import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";

type totalListProps = {
    isTab: string;
}

const Memos = ({isTab}: totalListProps) => {

    const {
        onMemoCreateSubmit,
        findAllMemo,
        memoId,
    } = useContext(MemoContext);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab1" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 p-1">
                <div
                    className={`flex flex-col`}
                    id="tab1">

                    {findAllMemo.data?.data?.length !== 0 ?
                        findAllMemo.data?.data?.map((memo) => {
                            return (
                                <MemoContextMenuWrapper
                                    onMemoDeleteSuccess={findAllMemo.refetch}
                                    memoId={memo?.id}
                                    key={memo?.id}
                                >
                                    <Link
                                        className={`
                                        flex text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer
                                        ${memoId == memo.id && "bg-gray-200 dark:bg-neutral-700"}
                                    `}
                                        to={`/w/${memo.id}`}
                                        key={memo.id}
                                    >
                                        <span className="text-sm tracking-wider">{memo.title || "(제목 없는 데이터)"}</span>
                                    </Link>
                                </MemoContextMenuWrapper>
                            )
                        })
                        :
                        <button
                            onClick={onMemoCreateSubmit}
                            className="mx-2 my-1 hover:bg-gray-100 pl-1 py-2 rounded-lg"
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