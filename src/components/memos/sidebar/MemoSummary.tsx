import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu.tsx";
import {Link, useNavigate} from "react-router-dom";
import {MemoSummaryDTO} from "@/openapi/memo/model";
import React, {useContext, useState} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FaRegStar, FaStar} from "react-icons/fa";
import {useDeleteMemo, useFindAllBookmarkedMemos, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";

type MemoSummaryPros = {
    memo: MemoSummaryDTO,
}

const MemoSummary = ({memo}: MemoSummaryPros) => {
    console.log(memo);

    const {
        memoId,
        findAllMemo,
    } = useContext(MemoContext);

    const navigate = useNavigate();

    const onDeleteSubmit = () => deleteMemo({memoId: memo.id});

    // 메모 삭제
    const {mutate: deleteMemo} = useDeleteMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("메모가 삭제되었습니다.");
                await findAllMemo.refetch();
                navigate("/w");
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            }
        }
    })

    /* 메모 즐겨찾기 조회 */
    const {
        refetch: refetchMemoBookmarked,
    } = useFindAllBookmarkedMemos({
        query: {
            queryKey: ['bookmarks']
        }
    });

    /* 메모 즐겨찾기 수정 */
    const {mutate: updateMemoBookmarked} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 즐겨찾기가 변경되었습니다.")
                await refetchMemoBookmarked();
                await findAllMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            },
        }
    });

    const handleBookmarked = () => {
        updateMemoBookmarked({
            memoId: memo.id!,
            data: {
                bookmarked: !memo.bookmarked,
            },
        })
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Link
                    className={`flex text-gray-900 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer
                        ${memoId == memo.id && "bg-gray-200 dark:bg-neutral-700"}`}
                    to={`/w/${memo.id}`}
                    key={memo.id}
                >
                    <span className="text-sm line-clamp-1">{memo.title || "제목없음"}</span>
                </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem>
                    <Dialog>
                        <DialogTrigger asChild>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 flex items-center bg-transparent hover:bg-gray-200 hover:bg-opacity-50 dark:hover:bg-black rounded-sm py-1 px-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                     className="w-4 h-4 mr-1.5">
                                    <path
                                        d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                                </svg>
                                <span className="text-sm cursor-pointer tracking-wider">삭제</span>
                            </div>
                        </DialogTrigger>
                        <DialogContent
                            className="flex flex-col max-w-[250px] h-[200px] sm:max-w-[300px] rounded-lg z-50">
                            <DialogHeader className="flex justify-center items-center">
                                <DialogTitle>삭제</DialogTitle>
                                <div className="py-5">메모를 삭제하시겠습니까?</div>
                            </DialogHeader>
                            <DialogFooter
                                className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                                <Button
                                    className="w-auto bg-indigo-400 hover:bg-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    type="submit"
                                    onClick={onDeleteSubmit}
                                >
                                    확인
                                </Button>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                    >
                                        닫기
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </ContextMenuItem>
                <ContextMenuItem>
                    <div
                        onClick={handleBookmarked}
                        className="flex items-center bg-transparent hover:bg-gray-200 hover:bg-opacity-50 dark:hover:bg-black rounded-sm py-1 px-1.5 cursor-pointer">
                        {memo.bookmarked ?
                            <>
                                <FaStar className="fill-yellow-400 stroke-yellow-400 w-5 h-5 mr-1"/>
                                <span className="text-sm cursor-pointer tracking-wider">즐겨찾기 해제</span>
                            </>
                            :
                            <>
                                <FaRegStar className="bg-transparent w-5 h-5 mr-1"/>
                                <span className="text-sm cursor-pointer tracking-wider">즐겨찾기 추가</span>
                            </>
                        }
                    </div>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default MemoSummary;