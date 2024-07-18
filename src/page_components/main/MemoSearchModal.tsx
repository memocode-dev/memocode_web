import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {useSearchMemoByKeyword} from "@/openapi/api/memos/memos";
import {CommandDialog, CommandInput, CommandList} from "@/components/ui/command";
import {DialogTitle} from "@/components/ui/dialog";
import {FiDelete} from "react-icons/fi";
import {Button} from "@/components/ui/button";
import {BiMessageSquareCheck} from "react-icons/bi";
import DOMPurify from "dompurify";
import Avatar from "react-avatar";
import {useRouter} from "next/navigation";
import timeSince from "@/components/utils/timeSince";
import {IoClose} from "react-icons/io5";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import * as React from "react";

const MemoSearchModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const router = useRouter();
    const [keyword, setKeyword] = useState<string>()

    const searchMemos =
        useSearchMemoByKeyword({
            keyword: keyword,
            page: 0,
            pageSize: 20,
        }, {
            query: {
                queryKey: ["MemoSearchModal", keyword]
            }
        })

    const formattedSearchMemos = searchMemos.data?.content?.map(content => content.formattedMemo);

    // 검색 키워드 색상 지정
    useEffect(() => {
        const primaryHSL = document.documentElement.style.getPropertyValue("--primary");

        const style = document.createElement('style');
        style.innerHTML = `
            .markdown-body em {
                font-style: normal;
                font-size:17px;
                color: hsl(${primaryHSL});
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [keyword]);

    return (
        <CommandDialog open={modalState[ModalTypes.MEMO_SEARCH].isVisible}>
            <VisuallyHidden.Root><DialogTitle/></VisuallyHidden.Root>
            <CommandList
                className="rounded-lg z-50 h-[90vh] overflow-y-auto outline-0">
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
                        <IoClose className="w-6 h-6"/>
                    </Button>
                </div>

                <CommandInput
                    value={keyword}
                    onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setKeyword(e.target.value)
                    }}
                    className="text-[16px] placeholder:text-gray-400"
                    placeholder="제목, 요약글, 내용으로 검색"/>

                {keyword &&
                    <div className="flex p-3 items-center space-x-1">
                        <BiMessageSquareCheck className="w-5 h-5"/>
                        <div className="text-sm">검색 결과</div>
                    </div>
                }

                {searchMemos.data && searchMemos?.data.totalCount === 0 &&
                    <div className="text-center text-[16px] py-1">
                        <span>검색된 메모가 없습니다.</span>
                    </div>
                }

                {/* 검색 내용 */}
                {keyword && searchMemos &&
                    <div
                        className="flex flex-1 flex-col space-y-3 w-full bg-transparent p-2 rounded overflow-y-auto">
                        {formattedSearchMemos && formattedSearchMemos.map((content, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setKeyword("");
                                        closeModal({name: ModalTypes.MEMO_SEARCH});
                                        typeof window !== 'undefined' && router.push(`/@${content?.user?.username}/memos/${content?.id}`);
                                    }}
                                    className="flex p-4 border border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:border-neutral-600 rounded cursor-pointer">

                                    <div className="flex flex-col flex-1 space-y-2 leading-snug break-all">
                                        <div
                                            className="markdown-body tracking-wide line-clamp-1"
                                            style={{fontWeight: 700, fontSize: 16}}
                                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content && content.title || "")}}></div>

                                        {content &&
                                            <div className="markdown-body tracking-wide line-clamp-1"
                                                 style={{fontWeight: 500, color: "#9ca3af", fontSize: 14}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content.summary || "")}}></div>
                                        }

                                        <div className="markdown-body tracking-wide line-clamp-2"
                                             style={{color: "#9ca3af", fontSize: 12}}
                                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(content && content.content || "")}}></div>

                                        <div className="flex space-x-2">
                                            <div className="flex items-center space-x-1">
                                                <Avatar
                                                    name={content?.user?.username}
                                                    size="23"
                                                    round="3px"/>
                                                <div className="text-[15px]">{content?.user?.username}</div>
                                            </div>

                                            {content &&
                                                <div className="flex space-x-1 text-xs text-gray-400 items-center">
                                                    <div>{content.updatedAt && timeSince(new Date(content.updatedAt))}</div>
                                                    <div>수정됨</div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
            </CommandList>
        </CommandDialog>
    )
}

export default MemoSearchModal;