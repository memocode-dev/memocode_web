import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
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
import QuestionPage__QuestionCommentUpdateModal
    from "@/page_components/question_page/QuestionPage__QuestionCommentUpdateModal.tsx";
import {Bounce, toast} from "react-toastify";
import {FindAllQuestionCommentQuestionCommentResult} from "@/openapi/model";
import QuestionPage__QuestionChildComments
    from "@/page_components/question_page/QuestionPage__QuestionChildComments.tsx";

interface QuestionPage__QuestionCommentsProps {
    comments: FindAllQuestionCommentQuestionCommentResult[];
}

const QuestionPage__QuestionComments = ({comments}: QuestionPage__QuestionCommentsProps) => {

    const {theme} = useContext(ThemeContext)
    const {questionId} = useParams()
    const {user_info, isLogined} = useKeycloak()
    const {openModal} = useContext(ModalContext)
    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
    const [handleCommentIdForCreateQuestionChildComment, setHandleCommentIdForCreateQuestionChildComment] = useState("")

    // 댓글 표시 상태를 토글하는 함수
    const toggleShowComment = (commentId: string) => {
        setShowComments(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId] // 현재 상태의 반대로 설정합니다.
        }));
    };

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [comments, theme]);

    const QuestionPage__QuestionComments__Profile = (comment: FindAllQuestionCommentQuestionCommentResult) => {
        return (
            <div
                className="flex flex-col space-y-1 sm:flex-row sm:space-x-1">
                <div className="flex space-x-1 items-center">
                    <Avatar
                        className="w-6 h-6 rounded"
                        name={comment.user?.username}
                        size="25"
                        round="5px"/>

                    <div
                        className="text-sm sm:text-md racking-wider">{comment && comment.user?.username}</div>
                </div>

                <div
                    className="ml-7 sm:m-0 sm:pt-2 text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                    {comment.updatedAt !== comment.createdAt &&
                        <>
                            {comment.updatedAt &&
                                new Date(comment?.updatedAt).toLocaleDateString()}
                            <span className="ml-1">수정됨</span>
                        </>
                    }

                    {comment.updatedAt === comment.createdAt &&
                        comment.createdAt && new Date(comment.updatedAt!).toLocaleDateString()}
                </div>
            </div>
        )
    }

    const QuestionPage__QuestionComments__CreateChildCommentButton = (comment: FindAllQuestionCommentQuestionCommentResult) => {
        return (
            <>
                {comment.childQuestionComments?.length !== 0 &&
                    <Button
                        onClick={() => {
                            toggleShowComment(comment.id!)
                        }}
                        variant="ghost"
                        className="w-fit h-fit px-2 py-2 bg-secondary text-primary hover:bg-secondary hover:text-primary"
                        type="submit"
                    >
                        <span>{showComments[comment.id!] ? "답글보기" : "답글닫기"}</span>
                    </Button>
                }

                {comment.childQuestionComments?.length === 0 &&
                    <Button
                        onClick={() => {
                            if (!isLogined) {
                                toast.warn("로그인 후 이용 가능합니다.", {
                                    position: "bottom-right",
                                    theme: theme,
                                    transition: Bounce,
                                });
                                return;
                            }

                            setHandleCommentIdForCreateQuestionChildComment(comment.id!)
                        }}
                        variant="ghost"
                        className={`${handleCommentIdForCreateQuestionChildComment === comment.id ? `bg-secondary text-primary` : ``}
                                       w-fit h-fit px-2 py-2 hover:bg-secondary hover:text-primary`}
                        type="submit"
                    >
                        <span>답글 달기</span>
                    </Button>
                }

            </>
        )
    }

    const QuestionPage__QuestionComments__SettingButton = (commentId: string) => {
        return (
            <Menubar className="border-none hover:bg-secondary cursor-pointer h-fit w-fit">
                <MenubarMenu>
                    <MenubarTrigger
                        className="group inline-flex px-1 py-1 items-center justify-center rounded-md cursor-pointer">
                        <IoIosMore className="w-5 h-5"/>
                    </MenubarTrigger>

                    <MenubarContent className="min-w-[7px] dark:bg-neutral-700 border-none">
                        {/* 수정 */}
                        <MenubarItem className="p-0 dark:hover:bg-black">
                            <Button
                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                onClick={() => {
                                    openModal({
                                        name: ModalTypes.QUESTION_COMMENT_UPDATE,
                                        data: {
                                            questionId: questionId,
                                            questionCommentId: commentId
                                        }
                                    });
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
                                        data: {
                                            questionId: questionId,
                                            questionCommentId: commentId
                                        }
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
        )
    }

    return (
        <>
            <div className="bg-background cursor-default">
                {comments?.length === 0 ?
                    <div className="py-20 flex flex-col items-center text-gray-400">
                        <div>아직 답변이 없네요!</div>
                        <div>처음으로 답변을 달아보세요.</div>
                    </div> : ""}

                {comments && comments?.map((comment, index) => {
                    return (
                        <div key={index}
                             className="flex flex-col border-b border-b-gray-300 dark:border-b-gray-500 py-5 h-fit">

                            <div className="flex justify-between">
                                {/* 프로필 */}
                                {comment && !comment.deleted && QuestionPage__QuestionComments__Profile(comment)}

                                <div className="flex items-center space-x-0.5">
                                    {/* 답글 달기 버튼 */}
                                    {comment && !comment.deleted && QuestionPage__QuestionComments__CreateChildCommentButton(comment)}

                                    {/* 설정 버튼 */}
                                    {comment && user_info?.id === comment.user?.id && !comment.deleted && QuestionPage__QuestionComments__SettingButton(comment.id!)}
                                </div>
                            </div>

                            <div className="font-medium leading-snug break-all py-5">
                                <div className="markdown-body"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(comment && comment.content || ""))}}></div>
                            </div>

                            {/* 대댓글 컴포넌트 */}
                            <QuestionPage__QuestionChildComments
                                comment={comment}
                                showComments={showComments}
                                handleCommentIdForCreateQuestionChildComment={handleCommentIdForCreateQuestionChildComment}
                                setHandleCommentIdForCreateQuestionChildComment={setHandleCommentIdForCreateQuestionChildComment}
                            />
                        </div>
                    )
                })}
            </div>

            <QuestionPage__QuestionCommentUpdateModal/>
            <QuestionPage__QuestionCommentDeleteModal/>
        </>
    )
}

export default QuestionPage__QuestionComments
