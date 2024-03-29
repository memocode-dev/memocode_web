import React, {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";

import {useSearchMemos} from "@/openapi/memo/api/memos/memos.ts";
import {useNavigate} from "react-router-dom";
import {
    CommandDialog,
    CommandInput,
    CommandList,
} from "@/components/ui/command.tsx";
import {MdOutlineContentPasteSearch} from "react-icons/md";
import {FiDelete} from "react-icons/fi";
import DOMPurify from "dompurify";
import {X} from "lucide-react";

const MemoSearch = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState("")

    const searchMemos =
        useSearchMemos({
            keyword: keyword,
            page: 1,
            pageSize: 20,
        }, {
            query: {
                queryKey: ["MemoSearch", keyword]
            }
        })

    return (
        <>
            <CommandDialog open={modalState[ModalTypes.MEMO_SEARCH].isVisible}>
                <CommandList className="max-h-[600px] h-[600px] bg-background">
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
                        className="placeholder:text-gray-400"
                        placeholder="제목, 대표글, 내용으로 검색"/>

                    {keyword && <span className="text-xs px-3 text-gray-500">검색 결과</span>}

                    {searchMemos?.data?.hits?.length === 0 &&
                        <div className="text-center text-xs py-2">
                            <span>찾는 메모가 없습니다.</span>
                        </div>
                    }

                    {/* 검색 내용 */}
                    {keyword && searchMemos &&
                        <div className="flex flex-col space-y-2 w-full flex-1 bg-transparent p-2 rounded">
                            {searchMemos?.data?.hits?.map((hit, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setKeyword("")
                                            closeModal({name: ModalTypes.MEMO_SEARCH})
                                            navigate(`/w/${hit._formatted.id}`)
                                        }}
                                        className="flex p-2 space-x-2 border border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:border-neutral-700 rounded cursor-pointer">

                                        <MdOutlineContentPasteSearch className="w-5 h-5 mt-0.5"/>

                                        <div className="flex flex-col flex-1 space-y-1 leading-snug break-all">
                                            <div
                                                className="markdown-body tracking-wide line-clamp-1"
                                                style={{fontWeight: 700}}
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(hit._formatted.title || "")}}></div>

                                            <div className="markdown-body tracking-wide line-clamp-1"
                                                 style={{fontWeight: 500, color: "#9ca3af", fontSize: 15}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(hit._formatted.summary || "")}}></div>

                                            <div className="markdown-body tracking-wide line-clamp-2"
                                                 style={{color: "#9ca3af", fontSize: 12}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(hit._formatted.content || "")}}></div>
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

export default MemoSearch