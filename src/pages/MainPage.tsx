import {Button} from "@/components/ui/button.tsx";
import {MdExpandMore} from "react-icons/md";
import {useSearchMemoByKeywordInfinite} from "@/openapi/api/memos/memos.ts";
import MainPage__Memo from "@/page_components/main_page/MainPage__Memo.tsx";

const MainPage = () => {
    const {
        isLoading,
        data: memos,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSearchMemoByKeywordInfinite({}, {
        query: {
            queryKey: ['MainPage'],
            getNextPageParam: (lastPage) => {
                if (!lastPage.last) {
                    return lastPage.page! + 1;
                }
            },
        }
    });

    const MainPage__Memos =
        memos?.pages.map((page, pageIndex) => (
            page?.content?.map((memo, memoIndex) => {
                return (
                    <MainPage__Memo key={`memo-${pageIndex}-${memoIndex}`} memo={memo} isLoading={isLoading}/>
                )
            })
        ));

    const MainPage__MemosMoreButton = hasNextPage && (
        <Button
            className="flex-1 bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200"
            onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? '불러오는 중' : <MdExpandMore className="w-7 h-7"/>}
        </Button>
    )

    return (
        <div
            className="flex flex-1 pt-[110px] bg-background overflow-y-auto px-3 sm:px-[50px] md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]">
            <div className="flex-1 pb-10">
                {/*<div className="flex justify-end py-5">*/}
                {/*    <MainPage__MemosTabButton icon={<MdHotelClass className="w-5 h-5"/>} label={"가장 인기있는 포스트"}/>*/}
                {/*    <MainPage__MemosTabButton icon={<BsClockHistory className="w-5 h-5"/>} label={"방금 올라온 포스트"}/>*/}
                {/*</div>*/}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {MainPage__Memos}
                </div>

                <div className="flex my-2">
                    {MainPage__MemosMoreButton}
                </div>
            </div>
        </div>
    )
}

export default MainPage;