'use client';

import {Button} from "@/components/ui/button";
import timeSince from "@/components/utils/timeSince";
import Avatar from "react-avatar";
import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {FindAllMemoCommentMemoCommentResult} from "@/openapi/model";
import {IoIosMore, IoMdArrowDropdown} from "react-icons/io";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar";
import {RiDeleteBin6Line, RiEraserLine} from "react-icons/ri";
import {useKeycloak} from "@/context/KeycloakContext";
import MemoCreateChildCommentButton from "@/components/page_components/memo/MemoCreateChildCommentButton";
import MemoChildComments from "@/components/page_components/memo/MemoChildComments";
import MemoCreateChildCommentModal from "@/components/page_components/memo/MemoCreateChildCommentModal";
import MemoUpdateCommentModal from "@/components/page_components/memo/MemoUpdateCommentModal";
import MemoDeleteCommentModal from "@/components/page_components/memo/MemoDeleteCommentModal";

interface MemoCommentsProps {
    memoId: string;
    comments: FindAllMemoCommentMemoCommentResult[];
}

const MemoComments = ({memoId, comments}: MemoCommentsProps) => {

    const {openModal} = useContext(ModalContext)
    const {user_info, isLogined} = useKeycloak()
    const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

    // 댓글 표시 상태를 토글하는 함수
    const toggleShowComment = (commentId: string) => {
        setShowComments(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId] // 현재 상태의 반대로 설정합니다.
        }));
    };

    const MemoCommentsProfile = (comment: FindAllMemoCommentMemoCommentResult) => (
        <div className="flex flex-col space-y-1 items-end sm:flex-row sm:space-x-1 sm:items-center">
            <div
                className="flex space-x-1 items-center">
                <Avatar
                    className="w-6 h-6 rounded"
                    name={comment.user?.username}
                    size="25"
                    round="3px"/>

                <div
                    className="text-sm sm:text-md tracking-wider">{comment.user?.username}</div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                {comment.updatedAt !== comment.createdAt &&
                    <div className="flex mb-1">
                        <div>{timeSince(new Date(comment.updatedAt!))}</div>
                        <div className="ml-1">수정됨</div>
                    </div>
                }

                {comment.updatedAt === comment.createdAt &&
                    <div className="flex mb-1">{timeSince(new Date(comment.createdAt!))}</div>
                }
            </div>
        </div>
    )

    const MemoCommentsSettingButton = (comment: FindAllMemoCommentMemoCommentResult) => {
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
                                        name: ModalTypes.MEMO_COMMENT_UPDATE,
                                        data: {
                                            memoId: memoId,
                                            comment: comment,
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
                                        name: ModalTypes.MEMO_COMMENT_DELETE,
                                        data: {
                                            memoId: memoId,
                                            commentId: comment.id,
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
                {comments?.length === 0 &&
                    <div className="py-20 flex flex-col items-center text-gray-400">
                        <div>아직 댓글이 없네요!</div>
                        <div>처음으로 댓글을 달아보세요.</div>
                    </div>
                }

                {comments && comments?.map((comment, index) => {
                    return (
                        <div
                            key={index}
                            className="flex flex-col border-b border-b-gray-300 dark:border-b-gray-500 py-6 h-fit">

                            <div className="flex justify-between">
                                {/* 프로필 */}
                                {MemoCommentsProfile(comment)}

                                <div className="flex items-center space-x-0.5">
                                    {/* 답글보기 / 닫기 */}
                                    <div
                                        className="flex items-center"
                                        onClick={() => {
                                            toggleShowComment(comment.id!)
                                        }}
                                    >
                                        <div
                                            className="text-sm">{!showComments[comment.id!] ? "닫기" : `${comment.childMemoComments?.length}개의 답글`}</div>

                                        <IoMdArrowDropdown
                                            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${!showComments[comment.id!] ? 'rotate-180' : ''}`}/>
                                    </div>

                                    {/* 답글 남기기 */}
                                    <MemoCreateChildCommentButton memoId={memoId!} commentId={comment.id!} commentDeleted={comment.deleted!} />

                                    {/* 설정 버튼 */}
                                    {isLogined && user_info?.id === comment.user?.id &&
                                        MemoCommentsSettingButton(comment)
                                    }
                                </div>
                            </div>

                            <div className="py-5">{comment.content}</div>

                            {/* 답글 리스트 */}
                            <MemoChildComments memoId={memoId} comment={comment} showComments={showComments}/>
                        </div>
                    )
                })}
            </div>

            <MemoCreateChildCommentModal/>
            <MemoUpdateCommentModal/>
            <MemoDeleteCommentModal/>
        </>
    )
}

export default MemoComments