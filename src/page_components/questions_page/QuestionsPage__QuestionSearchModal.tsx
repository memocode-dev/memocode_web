import React, {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {CommandDialog, CommandInput, CommandList} from "@/components/ui/command.tsx";
import {FiDelete} from "react-icons/fi";
import {Button} from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import DOMPurify from "dompurify";
import {FaRegClipboard} from "react-icons/fa";
import {useSearchQuestionByKeyword} from "@/openapi/api/questions/questions.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router-dom";

const QuestionsPage__QuestionSearchModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState<string>()

    const searchQuestions =
        useSearchQuestionByKeyword({
            keyword: keyword,
            page: 0,
            pageSize: 20,
        }, {
            query: {
                queryKey: ["QuestionsPage__QuestionSearchModal", keyword]
            }
        })

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

                    {searchQuestions.data?.totalCount === 0 &&
                        <div className="text-center text-xs py-2">
                            <span>찾는 메모가 없습니다.</span>
                        </div>
                    }

                    {/* 검색 내용 */}
                    {keyword && searchQuestions &&
                        <div className="flex flex-col space-y-2 w-full flex-1 bg-transparent p-4 rounded">
                            {searchQuestions.data?.content?.map((searchQuestion, index) => {
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setKeyword("")
                                            closeModal({name: ModalTypes.QUESTION_SEARCH})
                                            navigate(`/questions/${searchQuestion.id}`)
                                        }}
                                        className="flex p-2 space-x-2 border border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:border-neutral-700 rounded cursor-pointer">

                                        <FaRegClipboard className="w-4 h-4 mt-1"/>

                                        <div className="flex flex-col flex-1 space-y-1 leading-snug break-all">
                                            <div
                                                className="markdown-body tracking-wide line-clamp-1"
                                                style={{fontWeight: 700}}
                                                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(searchQuestion.title || "")}}></div>

                                            {/*<div className="markdown-body tracking-wide line-clamp-2"*/}
                                            {/*     style={{fontWeight: 500, color: "#9ca3af", fontSize: 15}}*/}
                                            {/*     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(searchQuestion.content || "")}}></div>*/}

                                            <div className="flex flex-wrap">
                                                {searchQuestion && searchQuestion.tags?.map((tag) => {
                                                    return (
                                                        <>
                                                            <Badge
                                                                className="text-xs text-white mr-1 my-1">{tag}</Badge>
                                                        </>
                                                    );
                                                })}
                                            </div>

                                            <div className="markdown-body tracking-wide"
                                                 style={{color: "#9ca3af", fontSize: 12}}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(searchQuestion?.user?.username || "")}}></div>
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

export default QuestionsPage__QuestionSearchModal