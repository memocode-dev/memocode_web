import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {Badge} from "@/components/ui/badge.tsx";
import {useContext, useEffect, useState} from "react";
import {QuestionDetailDto} from "@/openapi/question/model";
import {IoIosMore} from "react-icons/io";
import {Button} from "@/components/ui/button.tsx";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {RiDeleteBin6Line, RiEditLine} from "react-icons/ri";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import DeleteQuestion from "@/components/questions/DeleteQuestion.tsx";
import {useNavigate} from "react-router-dom";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {useKeycloak} from "@/context/KeycloakContext.tsx";

const QuestionContent = ({question}: { question: QuestionDetailDto }) => {

    const {user_info} = useKeycloak()
    const {theme} = useContext(ThemeContext)
    const {openModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const [like, setLike] = useState(false)
    const [count, setCount] = useState(0)

    const handleLike = () => {
        setLike(prev => !prev)

        if (like) {
            setCount(count - 1)
        } else {
            setCount(count + 1)
        }
    }

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [question, theme]);

    return (
        <>
            <div className="bg-background cursor-default">
                <div className="flex flex-wrap">
                    {question && question.tags?.map((tag) => {
                        return (
                            <>
                                <Badge
                                    className="text-md text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mx-1 my-1">{tag}</Badge>
                            </>
                        );
                    })}
                </div>

                <div className="border-b border-b-gray-300 py-5 my-14 space-y-10">
                    <div className="text-lg font-medium leading-snug break-all">
                        <div className="markdown-body"
                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(question && question.content || ""))}}></div>
                    </div>

                    {question && user_info?.username === question.author?.username &&
                        <div
                            className="flex justify-end">
                            <Menubar className="border-none hover:bg-secondary cursor-pointer">
                                <MenubarMenu>
                                    <MenubarTrigger
                                        className="group inline-flex px-1 h-fit w-fit items-center justify-center rounded-md text-sm font-medium cursor-pointer">
                                        <IoIosMore className="w-5 h-5"/>
                                    </MenubarTrigger>

                                    <MenubarContent className="min-w-[7px] dark:bg-neutral-700 border-none">
                                        {/* 수정 */}
                                        <MenubarItem className="p-0 dark:hover:bg-black">
                                            <Button
                                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                                onClick={() => {
                                                    navigate(`/questions/edit/${question.id}`)
                                                }}
                                            >
                                                <RiEditLine className="w-[18px] h-[18px]"/>
                                                <div className="ml-1 text-sm pr-1">수정</div>
                                            </Button>
                                        </MenubarItem>

                                        {/* 삭제 */}
                                        <MenubarItem className="p-0 dark:hover:bg-black">
                                            <Button
                                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                                onClick={() => {
                                                    openModal({
                                                        name: ModalTypes.QUESTION_DELETE
                                                    });
                                                }}
                                                type="button"
                                            >
                                                <RiDeleteBin6Line className="w-[18px] h-[18px]"/>
                                                <div className="ml-1 text-sm pr-1">삭제</div>
                                            </Button>
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        </div>
                    }

                </div>

                <div className="flex justify-center space-x-2">
                    <div onClick={handleLike} className="cursor-pointer">
                        {!like && <AiOutlineLike className="animate-bounce text-gray-500 dark:text-gray-400 w-9 h-9"/>}
                        {like && <AiFillLike className="text-indigo-500 w-9 h-9"/>}
                    </div>

                    <div
                        className="flex justify-center items-center bg-gray-200 dark:bg-neutral-700 w-9 h-9 rounded-full">
                        <span>{count}</span>

                    </div>
                </div>
            </div>

            <DeleteQuestion/>
        </>
    )
}

export default QuestionContent
