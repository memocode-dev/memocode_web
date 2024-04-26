import {Dialog, DialogClose, DialogContent, DialogFooter,} from "@/components/ui/dialog.tsx";
import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Command, CommandInput, CommandList} from "@/components/ui/command.tsx";
import {FiDelete} from "react-icons/fi";
import {Button} from "@/components/ui/button.tsx";
import DOMPurify from "dompurify";
import {useSearchMemo} from "@/openapi/api/memos/memos.ts";

interface DataItem {
    id: string;
    title: string;
    author_id: string;
    summary: string;
    _formatted: {
        author_id: string;
        content: string;
        id: string;
        summary: string;
        title: string;
    };
}

const MemoSeriesManagementPage__MemoSeriesAddModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const [keyword, setKeyword] = useState("")
    const [selectedPost, setSelectedPost] = useState<DataItem[]>([])

    const handleSelectPost = (post: any) => {
        if (!selectedPost.find((selected) => selected.id === post.id)) {
            setSelectedPost((prevSelectedItems) => [...prevSelectedItems, post]);
        }
    };

    const handleRemovePost = (post: DataItem) => {
        setSelectedPost((prevSelectedItems) =>
            prevSelectedItems.filter((selected) => selected.id !== post.id)
        );
    }

    const searchMemos =
        useSearchMemo({
            keyword: keyword,
            page: 1,
            pageSize: 20,
        }, {
            query: {
                queryKey: ["MemoSearch", keyword]
            }
        })

    return (
        <Dialog open={modalState[ModalTypes.MEMO_SERIES_ADD].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[80%] lg:min-w-[60%] h-[80vh] lg:h-[70vh] rounded-lg z-50 dark:bg-neutral-700 outline-0">
                <div className="flex flex-1 space-x-2">

                    {/* 포스트 검색 */}
                    <Command className="flex-1 rounded border border-gray-200 dark:border-neutral-800">
                        <CommandList
                            className="flex-1 bg-white dark:bg-neutral-700 outline-0 relative">
                            <div className="absolute right-3 top-3 flex space-x-3 items-center">
                                <div
                                    onClick={() => {
                                        setKeyword("")
                                    }}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer active:scale-90">
                                    <FiDelete className="w-5 h-5"/>
                                </div>
                            </div>

                            <CommandInput
                                value={keyword}
                                onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setKeyword(e.target.value)
                                }}
                                className="text-[13px] placeholder:text-transparent sm:placeholder:text-gray-400"
                                placeholder="포스트 검색"/>

                            <span className="text-[12px] px-2 text-gray-500 dark:text-gray-400">검색 결과</span>

                            {!keyword && <div className="h-[300px] overflow-y-auto"></div>}

                            {/* 검색 내용 */}
                            {keyword && searchMemos &&
                                <div
                                    className="flex flex-col pt-1 h-full overflow-y-auto">
                                    {searchMemos?.data?.hits?.map((hit, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="flex px-2 py-1 space-x-1 items-center hover:bg-gray-100 dark:hover:bg-neutral-800">
                                                <div
                                                    className="flex-1 cursor-default">
                                                    <div
                                                        className="markdown-body tracking-wide line-clamp-1"
                                                        style={{fontSize: 13}}
                                                        dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(hit._formatted?.title || "제목없음")}}>
                                                    </div>
                                                </div>

                                                <Button
                                                    className="w-auto h-auto px-2 py-1 text-sm text-gray-700 hover:text-white bg-gray-300 dark:bg-gray-300 hover:bg-primary dark:hover:bg-primary rounded
                                                     focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    onClick={() => {
                                                        handleSelectPost(hit)
                                                    }}
                                                >
                                                    선택
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </CommandList>
                    </Command>

                    {/* 선택된 포스트 */}
                    <div className="flex-1 rounded border border-gray-200 dark:border-neutral-800 p-2">
                        <div className="flex flex-col">
                            <span className="font-bold">선택된 포스트</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                선택한 포스트가 시리즈에 추가됩니다.
                            </span>
                        </div>

                        <div className="flex flex-col pt-1 h-full overflow-y-auto">
                            {selectedPost.map((post, index) => {
                                return (
                                    <div key={index}
                                         className="flex px-2 py-1 space-x-1 items-center hover:bg-gray-100 dark:hover:bg-neutral-800">
                                        <div
                                            className="flex-1 cursor-default">
                                            <div
                                                className="markdown-body tracking-wide line-clamp-1"
                                                style={{fontSize: 13}}
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.title)}}>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-auto h-auto px-2 py-1 text-sm text-gray-700 hover:text-white bg-gray-300 dark:bg-gray-300 hover:bg-primary dark:hover:bg-primary rounded
                                                     focus-visible:ring-0 focus-visible:ring-offset-0"
                                            onClick={() => {
                                                handleRemovePost(post)
                                            }}
                                        >
                                            제거
                                        </Button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <DialogClose asChild>
                        <Button
                            className="w-auto bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                            type="submit"
                        >
                            저장
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            onClick={() => {
                                setKeyword("")
                                setSelectedPost([])
                                closeModal({name: ModalTypes.MEMO_SERIES_ADD})
                            }}
                            type="button"
                            variant="secondary"
                            className="hover:bg-secondary-hover"
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MemoSeriesManagementPage__MemoSeriesAddModal