import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import {useSearchQuestion} from "@/openapi/api/questions/questions.ts";
import {Badge, X} from "lucide-react";
import DOMPurify from "dompurify";
import {FaRegClipboard} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const TagsPage__SearchedQuestionsModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState<string>()

    useEffect(() => {
        if (modalState[ModalTypes.TAG_SEARCH].data.keyword) {
            setKeyword(modalState[ModalTypes.TAG_SEARCH].data.keyword)
        }
    }, [modalState[ModalTypes.TAG_SEARCH].data]);

    const searchQuestionsByTag =
        useSearchQuestion({
            keyword: keyword,
            page: 0,
            pageSize: 20,
        }, {
            query: {
                queryKey: ["TagsPage__SearchedQuestionsModal", keyword]
            }
        })

    return (
        <Dialog open={modalState[ModalTypes.TAG_SEARCH].isVisible}>
            <DialogContent className="flex flex-col min-w-[80%] min-h-[80%] bg-background">
                <div className="flex flex-col items-end">
                    <Button
                        variant="secondary"
                        className="hover:bg-secondary-hover w-fit h-fit p-1 select-none rounded"
                        type="button"
                        onClick={() => {
                            closeModal({name: ModalTypes.TAG_SEARCH})
                        }}
                    >
                        <X className="w-6 h-6"/>
                    </Button>
                </div>

                {/* 검색 내용 */}
                {keyword && searchQuestionsByTag &&
                    <div className="flex flex-col flex-1 space-y-2 w-full bg-transparent rounded">
                        {searchQuestionsByTag.data?.content?.map((searchQuestion, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        closeModal({name: ModalTypes.TAG_SEARCH})
                                        navigate(`/questions/${searchQuestion.id}`)
                                    }}
                                    className="flex p-2 space-x-2 border border-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700 dark:border-neutral-700 rounded cursor-pointer">

                                    <FaRegClipboard className="w-4 h-4 mt-1"/>

                                    <div className="flex flex-col flex-1 space-y-1 leading-snug break-all">
                                        <div
                                            className="markdown-body tracking-wide line-clamp-1"
                                            style={{fontWeight: 700}}
                                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(searchQuestion.title || "")}}></div>

                                        <div className="markdown-body tracking-wide line-clamp-2"
                                             style={{fontWeight: 500, color: "#9ca3af", fontSize: 15}}
                                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(searchQuestion.content || "")}}></div>

                                        <div className="flex flex-wrap">
                                            {searchQuestion && searchQuestion.tags?.map((tag, index) => {
                                                console.log("tag", tag)
                                                return (
                                                    <>
                                                        <Badge
                                                            key={index}
                                                            className="text-xs text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1 my-1">{tag}</Badge>
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
            </DialogContent>
        </Dialog>
    )
}

export default TagsPage__SearchedQuestionsModal;