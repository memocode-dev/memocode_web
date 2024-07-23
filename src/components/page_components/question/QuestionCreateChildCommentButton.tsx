'use client'

import {Button} from "@/components/ui/button";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {RiEditLine} from "react-icons/ri";
import {useContext} from "react";
import {Bounce, toast} from "react-toastify";
import {useKeycloak} from "@/context/KeycloakContext";
import {useTheme} from "@/context/ThemeContext";

interface QuestionCreateChildCommentButtonProps {
    questionId: string;
    commentId: string;
    commentDeleted: boolean;
}

const QuestionCreateChildCommentButton = ({
                                              questionId,
                                              commentId,
                                              commentDeleted
                                          }: QuestionCreateChildCommentButtonProps) => {

    const {openModal} = useContext(ModalContext)
    const {isLogined} = useKeycloak()
    const {theme} = useTheme()

    return (
        <Button
            className="flex bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit"
            onClick={() => {

                if (!isLogined) {
                    toast.warning("로그인 후 이용가능합니다.", {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                        className:"text-sm"
                    });
                    return
                }

                if (commentDeleted) {
                    toast.error("삭제된 답변에는 답글을 남길 수 없습니다.", {
                        className: "text-sm",
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                    });
                    return
                }

                openModal({
                    name: ModalTypes.QUESTION_CHILD_COMMENT_CREATE,
                    data: {
                        questionId: questionId,
                        questionCommentId: commentId,
                    }
                });
            }}
        >
            <RiEditLine className="w-[17px] h-[17px]"/>
            <div className="ml-1 text-sm pr-1">답글 남기기</div>
        </Button>
    )
}

export default QuestionCreateChildCommentButton;