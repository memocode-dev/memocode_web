import React, {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {CommandDialog, CommandInput, CommandList,} from "@/components/ui/command.tsx";
import {MdOutlineContentPasteSearch} from "react-icons/md";
import {FiDelete} from "react-icons/fi";
import DOMPurify from "dompurify";
import {X} from "lucide-react";
import {useSearchMyMemo} from "@/openapi/api/users-memos/users-memos.ts";

const MemoWritePageLayout__MemoSearchModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState("")

    const searchMemos =
        useSearchMyMemo({
            keyword: keyword,
            page: 0,
            pageSize: 20,
        }, {
            query: {
                queryKey: ["MemoWritePageLayout__MemoSearchModal", keyword]
            }
        })

    return (
        <>
            <CommandDialog open={modalState[ModalTypes.MEMO_SEARCH].isVisible}>
                <CommandList
                    className="bg-background rounded-lg z-50 dark:bg-neutral-700 h-[90vh] overflow-y-auto outline-0">
                    <div className="fixed right-2 top-2.5 flex space-x-3 items-center">
                        <div
                            onClick={() => {
                                setKeyword("")
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 cursor-pointer active:scale-90">
                            <FiDelete className="w-6 h-6"/>
                        </div>

                        <Button
                            variant="secondary"
                            className="hover:bg-secondary-hover w-fit h-fit p-1 select-none rounded"
                            type="button"
                            onClick={() => {
                                setKeyword("")
                                closeModal({name: ModalTypes.MEMO_SEARCH})
                            }}
                        >
                            <X className="w-6 h-6"/>
                        </Button>
                    </div>

                    <CommandInput
                        value={keyword}
                        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setKeyword(e.target.value)
                        }}
                        className="placeholder:text-transparent sm:placeholder:text-gray-400"
                        placeholder="제목, 대표글, 내용으로 검색"/>

                    {keyword && <span className="text-xs px-3 text-gray-500">검색 결과</span>}

                    {searchMemos?.data?.content?.length === 0 &&
                        <div className="text-center text-xs py-2">
                            <span>찾는 메모가 없습니다.</span>
                        </div>
                    }

                    {/* 검색 내용 */}
                    {keyword && searchMemos &&
                        <div
                            className="flex flex-col space-y-2 w-full flex-1 bg-transparent p-2 rounded h-[625px] overflow-y-auto">
                            {searchMemos?.data?.content?.map((content, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setKeyword("")
                                            closeModal({name: ModalTypes.MEMO_SEARCH})
                                            navigate(`/w/${content.formattedMemo?.id}`)
                                        }}
                                        className="flex p-2 space-x-2 border border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:border-neutral-600 rounded cursor-pointer">

                                        <MdOutlineContentPasteSearch className="w-5 h-5 mt-0.5"/>

                                        <div className="flex flex-col flex-1 space-y-1 leading-snug break-all">
                                            <div
                                                className="markdown-body tracking-wide line-clamp-1"
                                                style={{fontWeight: 700}}
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content.formattedMemo?.title || "")}}></div>

                                            <div className="markdown-body tracking-wide line-clamp-1"
                                                 style={{fontWeight: 500, color: "#9ca3af", fontSize: 15}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content.formattedMemo?.summary || "")}}></div>

                                            <div className="markdown-body tracking-wide line-clamp-2"
                                                 style={{color: "#9ca3af", fontSize: 12}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content.formattedMemo?.content || "")}}></div>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }

                </CommandList>
            </CommandDialog>
        </>
    )
}

export default MemoWritePageLayout__MemoSearchModal