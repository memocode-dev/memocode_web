import {useFindAllBookmarkedMemos} from "@/openapi/memo/api/memos/memos.ts";
import MemoSummary from "@/components/memos/sidebar/MemoSummary.tsx";

interface bookmarkListProps {
    isTab: string;
}

const Bookmarks = ({isTab}: bookmarkListProps) => {

    const {
        data: bookmarkedMemos
    } = useFindAllBookmarkedMemos({
        query: {
            queryKey: ['bookmarks']
        }
    });

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab2" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 py-1">

                <div
                    className={`flex flex-col space-y-1`}
                    id="tab1">

                    {bookmarkedMemos?.data?.map((bookmarkedMemo) => {
                        return <MemoSummary key={bookmarkedMemo.id} memo={bookmarkedMemo}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default Bookmarks