import {AiFillLike, AiOutlineLike} from "react-icons/ai";
import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useFindAllQuestionComment} from "@/openapi/api/questions-comments/questions-comments.ts";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import Avatar from "react-avatar";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {IoIosMore} from "react-icons/io";
import {Button} from "@/components/ui/button.tsx";
import {RiDeleteBin6Line, RiEditLine} from "react-icons/ri";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import QuestionPage__QuestionCommentDeleteModal
    from "@/page_components/question_page/QuestionPage__QuestionCommentDeleteModal.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";

interface Likes {
    [key: string]: boolean;
}

interface Counts {
    [key: string]: number;
}

const QuestionPage__QuestionAnswer = () => {

    const {theme} = useContext(ThemeContext)
    const {questionId} = useParams()
    const {user_info} = useKeycloak()
    const {openModal} = useContext(ModalContext)

    const [likes, setLikes] = useState<Likes>({});
    const [counts, setCounts] = useState<Counts>({});

    const {
        data: comments
    } = useFindAllQuestionComment(questionId!, {
        query: {
            queryKey: ['QuestionPage__QuestionAnswer', questionId]
        }
    });

    const handleLike = (commentId: string) => {

        const isLiked = !likes[commentId];
        const currentCount = counts[commentId] || 0

        setLikes(prevLikes => ({
            ...prevLikes,
            [commentId]: !prevLikes[commentId]
        }));

        setCounts(prevCounts => ({
            ...prevCounts,
            [commentId]: isLiked ? currentCount + 1 : currentCount - 1
        }));
    }

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [comments, theme]);

    const QuestionPage__QuestionAnswer__SettingButton = (commentId: string) => {
        return (
            <div
                className="flex justify-end">
                <Menubar className="border-none hover:bg-secondary cursor-pointer">
                    <MenubarMenu>
                        <MenubarTrigger
                            className="group inline-flex px-1.5 h-fit w-fit items-center justify-center rounded-md text-sm font-medium cursor-pointer">
                            <IoIosMore className="w-5 h-5"/>
                        </MenubarTrigger>

                        <MenubarContent className="min-w-[7px] dark:bg-neutral-700 border-none">
                            {/* 수정 */}
                            <MenubarItem className="p-0 dark:hover:bg-black">
                                <Button
                                    className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                    onClick={() => {
                                        // navigate(`/questions/edit/${question.id}`)
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
                                            name: ModalTypes.QUESTION_COMMENT_DELETE,
                                            data: commentId
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
        )
    }

    return (
        <>
            <div className="bg-background py-5 cursor-default">
                <div className="text-md font-bold leading-snug break-all">
                    답변 {comments?.length}
                </div>

                {comments?.map((comment, index) => {
                    return (
                        <div key={index} className="flex flex-col border-b border-b-gray-300 px-3 py-7 h-fit">
                            <div className="flex items-start sm:items-center">
                                <div
                                    className="flex space-y-0.5 space-x-1">
                                    <div className="flex space-x-1">
                                        <Avatar
                                            className="w-6 h-6 rounded"
                                            name={comment.user?.username}
                                            size="25"
                                            round="5px"/>

                                        <div
                                            className="text-sm sm:text-md racking-wider">{comment && comment.user?.username}</div>
                                    </div>

                                    <div className="text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                                        {comment.updatedAt !== comment.createdAt &&
                                            <>
                                                {comment.updatedAt &&
                                                    new Date(comment?.updatedAt).toLocaleDateString('en-CA', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    }).replace(/-/g, '.')}
                                                <span className="ml-1">수정됨</span>
                                            </>
                                        }

                                        {comment.updatedAt === comment.createdAt &&
                                            comment.createdAt &&
                                            new Date(comment?.createdAt).toLocaleDateString('en-CA', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            }).replace(/-/g, '.')

                                        }
                                    </div>
                                </div>

                                <div className="flex flex-1 justify-end space-x-1">
                                    <div
                                        onClick={() => {
                                            handleLike(comment.id!)
                                        }}
                                        className="cursor-pointer">
                                        {!likes[comment.id!] &&
                                            <AiOutlineLike className="text-gray-500 dark:text-gray-400 w-6 h-6"/>}
                                        {likes[comment.id!]
                                            && <AiFillLike className="text-indigo-500 w-6 h-6"/>}
                                    </div>

                                    <div
                                        className="flex justify-center items-center bg-gray-200 dark:bg-neutral-700 w-7 h-7 rounded-full">
                                        <span className="text-sm">{counts[comment.id!] ? counts[comment.id!] : 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="font-medium leading-snug break-all mt-2">
                                <div className="markdown-body"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(comment && comment.content || ""))}}></div>
                            </div>

                            {comment && user_info?.id === comment.user?.id &&
                                QuestionPage__QuestionAnswer__SettingButton(comment.id!)
                            }

                        </div>
                    )
                })}
            </div>

            <QuestionPage__QuestionCommentDeleteModal/>
        </>
    )
}

export default QuestionPage__QuestionAnswer