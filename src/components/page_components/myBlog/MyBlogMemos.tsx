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
        <div className="flex flex-1 flex-col bg-background">
            {pageContents?.map((memos, index) =>
                memos?.map((memo, index) => {
                    return (
                        <Link
                            href={`/@${username}/memos/${memo.id}`}
                            key={index}
                            className="flex h-[150px] md:h-[200px] bg-transparent border-4 border-transparent hover:border-gray-50 hover:bg-gray-50 dark:hover:bg-neutral-900 dark:hover:border-neutral-900 rounded cursor-pointer mb-7">

                            <div
                                className="flex flex-col flex-1 h-full p-5 justify-between mr-2">
                                <div>
                                    <div
                                        className="text-lg md:text-xl font-bold line-clamp-1 md:line-clamp-none">{memo.title}</div>
                                    <div
                                        className="text-sm md:text-md font-semibold text-gray-500 dark:text-gray-400 line-clamp-2">{memo.summary}</div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="hidden md:flex flex-wrap mb-1">
                                        {memo.tags?.map((tag, index) => {
                                            return (
                                                tag.length <= 9 &&
                                                <Badge
                                                    key={index}
                                                    className="bg-primary mr-1 mb-1">
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

                            {!memo.thumbnailUrl &&
                                <div
                                    className="flex items-center justify-center bg-secondary w-[150px] md:w-[250px] h-full rounded">
                                    <div className="logo-font text-md md:text-2xl text-gray-400">MEMOCODE
                                    </div>
                                </div>
                            }
                            {memo.thumbnailUrl &&
                                <img src={memo.thumbnailUrl}
                                     className="hidden sm:flex w-[150px] md:w-[250px] h-full rounded"/>
                            }
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