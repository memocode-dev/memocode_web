'use client'

import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {useSearchMemoByUsernameInfinite} from "@/openapi/api/users/users";
import {useParams} from "next/navigation";
import {useEffect, useRef} from "react";

const MyBlogMemos = () => {

    const {ascii_annotation_username} = useParams<{ ascii_annotation_username: string }>() // %40dbflarla4966
    const username = ascii_annotation_username.replace("%40", "") // dbflarla4966

    const {
        data: searchMyBlogMemos,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useSearchMemoByUsernameInfinite(username, {pageSize: 10},
        {
            query: {
                queryKey: ['MyBlogMemos', username],
                getNextPageParam: (nextPages) => {
                    if (!nextPages.last) { // 이후에 불러올 메모가 없다면 // nextPages.last => 이후에 불러올 메모가 없으면 false, 있으면 true
                        return nextPages.page! + 1; // nextPages.page_components => 첫번째 16개(page_components:0) / 두번째 16개(page_components:1) / 세번째 16개(page_components:2)
                    }
                },
            },
        }
    );

    const pageContents = searchMyBlogMemos?.pages.map((page) => page.content);

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

    return (
        <div className="flex flex-1 flex-col bg-background rounded">
            {pageContents?.map((memos, index) =>
                memos?.map((memo, index) => {
                    return (
                        <Link key={index}
                              href={`/@${username}/memos/${memo.id}`}
                              className="flex justify-between h-[150px] md:h-[220px] bg-transparent hover:bg-secondary cursor-pointer p-5">
                            <div
                                className="flex flex-col flex-1 justify-between mr-2">
                                <div>
                                    <div
                                        className="text-lg md:text-xl font-bold line-clamp-1 md:line-clamp-none">{memo.title}</div>
                                    <div
                                        className="text-sm md:text-md font-semibold text-gray-500 dark:text-gray-400 line-clamp-2">{memo.summary}</div>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <div className="hidden md:flex">
                                        {memo.tags?.map((tag, index) => {
                                            return (
                                                tag.length <= 9 &&
                                                <Badge
                                                    key={index}
                                                    className="bg-primary mr-1">
                                                    {tag}
                                                </Badge>

                                            );
                                        })}
                                    </div>

                                    <div className="flex">
                                        <div className="text-sm text-gray-500 dark:text-gray-400 tracking-wider">
                                            {memo.createdAt &&
                                                new Date(memo.createdAt).toLocaleDateString('en-CA', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                }).replace(/-/g, '.')
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {memo.thumbnailUrl &&
                                <img src={memo.thumbnailUrl}
                                     className="hidden sm:flex w-[150px] md:w-[220px] h-full"/>}

                        </Link>
                    )
                })
            )}

            <div ref={loadMoreRef} className="flex my-2 justify-center items-center">
                {isFetchingNextPage ? '불러오는 중...' : hasNextPage}
            </div>
        </div>
    )
}

export default MyBlogMemos;