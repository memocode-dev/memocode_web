'use client'

import {PageResponseSearchMemoMemoResult, SearchMemoMemoResult} from "@/openapi/model";
import {useSearchMemoByKeywordInfinite} from "@/openapi/api/memos/memos";
import {useContext, useEffect, useRef} from "react";
import {FiSearch} from "react-icons/fi";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import Memo from "@/page_components/memos/Memo";
import MemoSearchModal from "@/page_components/memos/MemoSearchModal";

interface MemosPageProps {
    searchAllMemos: PageResponseSearchMemoMemoResult;
}

const MemosPage = ({searchAllMemos}: MemosPageProps) => {

    const {openModal} = useContext(ModalContext)

    const {
        data: searchMemos,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useSearchMemoByKeywordInfinite({pageSize: 16},
        {
            query: {
                queryKey: [MemosPage, searchAllMemos],
                getNextPageParam: (nextPages) => {
                    if (!nextPages.last) { // 이후에 불러올 메모가 없다면 // nextPages.last => 이후에 불러올 메모가 없으면 false, 있으면 true
                        return nextPages.page! + 1; // nextPages.page_components => 첫번째 16개(page_components:0) / 두번째 16개(page_components:1) / 세번째 16개(page_components:2)
                    }
                },
                initialData: {
                    pages: [searchAllMemos],
                    pageParams: [],
                },
            },
        }
    );

    const pageContents = searchMemos?.pages.map((page) => page.content);

    const observer = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // 스크롤 끝까지 가면 다음페이지 불러오기
    useEffect(() => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });

        if (loadMoreRef.current) {
            observer.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const Memos =
        pageContents?.map((memos, pageIndex) => {
            const sortedMemos = memos?.sort((a: SearchMemoMemoResult, b: SearchMemoMemoResult) => {
                const dateA = new Date(a.createdAt!).getTime();
                const dateB = new Date(b.createdAt!).getTime();
                return dateB - dateA;
            });

            return sortedMemos?.map((memo, memoIndex) => (
                <Memo key={`memo-${pageIndex}-${memoIndex}`} memo={memo} isLoading={isLoading}/>
            ));
        });

    return (
        <>
            <div
                className="flex flex-1 pb-10 md:pb-0 pt-[110px] bg-background px-3 sm:px-[50px] md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]">
                <div className="flex-1 pb-10">
                    {/*<div className="flex justify-end py-5">*/}
                    {/*    <MainPage__MemosTabButton icon={<MdHotelClass className="w-5 h-5"/>} label={"가장 인기있는 포스트"}/>*/}
                    {/*    <MainPage__MemosTabButton icon={<BsClockHistory className="w-5 h-5"/>} label={"방금 올라온 포스트"}/>*/}
                    {/*</div>*/}

                    {/* 검색 버튼 */}
                    <div className="flex justify-center pb-10">
                        <div
                            className="flex w-full h-14 justify-center items-center p-3 space-x-2 rounded my-3 cursor-pointer transform transition duration-300
                        bg-transparent border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-900 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            onClick={() => {
                                openModal({
                                    name: ModalTypes.MEMO_SEARCH,
                                })
                            }}>
                            <FiSearch className="w-6 h-6"/>
                            <span className="text-md sm:text-lg font-semibold">메모를 검색해보세요!</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                        {Memos}
                    </div>

                    <div ref={loadMoreRef} className="flex my-2 justify-center items-center">
                        {isFetchingNextPage ? '불러오는 중...' : hasNextPage}
                    </div>
                </div>
            </div>

            <MemoSearchModal/>
        </>
    )
}

export default MemosPage;