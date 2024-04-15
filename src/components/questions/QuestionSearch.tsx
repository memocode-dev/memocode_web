import React, {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {CommandDialog, CommandInput, CommandList} from "@/components/ui/command.tsx";
import {FiDelete} from "react-icons/fi";
import {Button} from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import DOMPurify from "dompurify";
import {faker} from "@faker-js/faker";
import {FaRegClipboard} from "react-icons/fa";

const QuestionSearch = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const [keyword, setKeyword] = useState("")

    // 가짜 데이터 생성
    const fakeDatas = Array.from({length: 10}, () => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraph(),
        username: faker.internet.userName()
    }));

    return (
        <>
            <CommandDialog open={modalState[ModalTypes.QUESTION_SEARCH].isVisible}>
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
                                closeModal({name: ModalTypes.QUESTION_SEARCH})
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
                        placeholder="제목, 내용, 아이디로 검색"/>

                    {keyword && <span className="text-xs px-4 text-gray-500">검색 결과</span>}

                    {fakeDatas.length === 0 &&
                        <div className="text-center text-xs py-2">
                            <span>찾는 메모가 없습니다.</span>
                        </div>
                    }

                    {/* 검색 내용 */}
                    {keyword && fakeDatas &&
                        <div className="flex flex-col space-y-2 w-full flex-1 bg-transparent p-4 rounded">
                            {fakeDatas.map((fakeData, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setKeyword("")
                                            closeModal({name: ModalTypes.QUESTION_SEARCH})
                                            // navigate(`/w/${hit._formatted.id}`)
                                        }}
                                        className="flex p-2 space-x-2 border border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:border-neutral-700 rounded cursor-pointer">

                                        <FaRegClipboard className="w-4 h-4 mt-1"/>

                                        <div className="flex flex-col flex-1 space-y-1 leading-snug break-all">
                                            <div
                                                className="markdown-body tracking-wide line-clamp-1"
                                                style={{fontWeight: 700}}
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(fakeData.title || "")}}></div>

                                            <div className="markdown-body tracking-wide line-clamp-2"
                                                 style={{fontWeight: 500, color: "#9ca3af", fontSize: 15}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(fakeData.content || "")}}></div>

                                            <div className="markdown-body tracking-wide"
                                                 style={{color: "#9ca3af", fontSize: 12}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(fakeData.username || "")}}></div>
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

export default QuestionSearch