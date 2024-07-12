import {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import Avatar from "react-avatar";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {IoIosMore, IoMdArrowDropdown} from "react-icons/io";
import {Button} from "@/components/ui/button.tsx";
import {RiDeleteBin6Line, RiEraserLine} from "react-icons/ri";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import QuestionPage__QuestionCommentDeleteModal
    from "@/page_components/question_page/QuestionPage__QuestionCommentDeleteModal.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import QuestionPage__QuestionCommentUpdateModal
    from "@/page_components/question_page/QuestionPage__QuestionCommentUpdateModal.tsx";
import {FindAllQuestionCommentQuestionCommentResult} from "@/openapi/model";
import QuestionPage__QuestionChildComments
    from "@/page_components/question_page/QuestionPage__QuestionChildComments.tsx";
import QuestionPage__QuestionChildComments__QuestionCreateChildCommentButton
    from "@/page_components/question_page/QuestionPage__QuestionChildComments__QuestionCreateChildCommentButton.tsx";
import QuestionPage__QuestionCreateChildCommentModal
    from "@/page_components/question_page/QuestionPage__QuestionCreateChildCommentModal.tsx";

interface QuestionPage__QuestionCommentsProps {
    comments: FindAllQuestionCommentQuestionCommentResult[];
}

const QuestionPage__QuestionComments = ({comments}: QuestionPage__QuestionCommentsProps) => {

    const {theme} = useContext(ThemeContext)
    const {questionId} = useParams()
    const {user_info, isLogined} = useKeycloak()
    const {openModal} = useContext(ModalContext)
    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

    // 답글 표시 상태를 토글하는 함수
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
                        round="3px"/>

                    <div
                        className="text-sm sm:text-md tracking-wider">{comment && comment.user?.username}</div>
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

    const QuestionPage__QuestionComments__SettingButton = (comment: FindAllQuestionCommentQuestionCommentResult) => {
        return (
            <Menubar className="border-none hover:bg-secondary cursor-pointer h-fit w-fit">
                <MenubarMenu>
                    <MenubarTrigger
                        className="group inline-flex px-1 py-1 items-center justify-center rounded-md cursor-pointer">
                        <IoIosMore className="w-5 h-5"/>
                    </MenubarTrigger>

                    <MenubarContent sideOffset={10} align="end" className="min-w-[7px] dark:bg-neutral-700 border-none">
                        {/* 수정 */}
                        <MenubarItem className="p-0">
                            <Button
                                disabled={comment.deleted}
                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                onClick={() => {
                                    openModal({
                                        name: ModalTypes.QUESTION_COMMENT_UPDATE,
                                        data: {
                                            questionId: questionId,
                                            questionComment: comment
                                        }
                                    });
                                }}
                            >
                                <RiEraserLine className="w-[18px] h-[18px]"/>
                                <div className="ml-1 text-sm pr-1">수정</div>
                            </Button>
                        </MenubarItem>

                        {/* 삭제 */}
                        <MenubarItem className="p-0">
                            <Button
                                disabled={comment.deleted}
                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                onClick={() => {
                                    openModal({
                                        name: ModalTypes.QUESTION_COMMENT_DELETE,
                                        data: {
                                            questionId: questionId,
                                            questionCommentId: comment.id
                                        }
                                    });
                                }}
                                type="button"
                            >
                                <RiDeleteBin6Line className="w-[17px] h-[17px]"/>
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
                                {QuestionPage__QuestionComments__Profile(comment)}

                                <div className="flex items-center space-x-0.5">
                                    {/* 답글보기 / 닫기 */}
                                    <div
                                        className="flex items-center"
                                        onClick={() => {
                                            toggleShowComment(comment.id!)
                                        }}
                                    >
                                        <div
                                            className="text-sm">{!showComments[comment.id!] ? "닫기" : `${comment.childQuestionComments?.length}개의 답글`}</div>

                                        <IoMdArrowDropdown
                                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${!showComments[comment.id!] ? 'rotate-180' : ''}`}/>
                                    </div>

                                    {/* 답글 남기기 */}
                                    <QuestionPage__QuestionChildComments__QuestionCreateChildCommentButton
                                        questionId={questionId!} commentId={comment.id!}
                                        commentDeleted={comment.deleted!}/>

                                    {/* 설정 버튼 */}
                                    {isLogined && user_info?.id === comment.user?.id &&
                                        QuestionPage__QuestionComments__SettingButton(comment)
                                    }
                                </div>
                            </div>

                            <div className="font-medium leading-snug break-all py-5">
                                <div className="markdown-body"
                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(comment && comment.content || ""))}}></div>
                            </div>

                            {/* 답글 리스트 */}
                            <QuestionPage__QuestionChildComments
                                comment={comment} showComments={showComments}
                            />
                        </div>
                    )
                })}
            </div>

            <QuestionPage__QuestionCreateChildCommentModal/>
            <QuestionPage__QuestionCommentUpdateModal/>
            <QuestionPage__QuestionCommentDeleteModal/>
        </>
    )
}

export default QuestionPage__QuestionComments
