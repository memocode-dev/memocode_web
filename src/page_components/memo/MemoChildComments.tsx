'use client';

import {FindAllMemoCommentMemoCommentResult} from "@/openapi/model";
import Avatar from "react-avatar";
import timeSince from "@/components/utils/timeSince";
import {Button} from "@/components/ui/button";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {useContext, useEffect, useState} from "react";
import {useKeycloak} from "@/context/KeycloakContext";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar";
import {IoIosMore} from "react-icons/io";
import {RiDeleteBin6Line, RiEditLine} from "react-icons/ri";
import {BsEmojiTear} from "react-icons/bs";
import MemoCreateChildCommentButton from "@/page_components/memo/MemoCreateChildCommentButton";

interface MemoChildCommentsProps {
    memoId: string;
    comment: FindAllMemoCommentMemoCommentResult;
    showComments: { [key: string]: boolean };
}

const MemoChildComments = ({
                               memoId,
                               comment,
                               showComments
                           }: MemoChildCommentsProps) => {

    const {user_info, isLogined} = useKeycloak()
    const {openModal} = useContext(ModalContext)
    const [dynamicHeight, setDynamicHeight] = useState("");

    // 답글 갯수의 따라 답글리스트 높이 설정
    useEffect(() => {
        if (!showComments[comment.id!]) {
            setDynamicHeight(`${comment.childMemoComments!.length * 240 + 120}px`);
        } else {
            setDynamicHeight('0px');
        }
    }, [showComments, comment.childMemoComments]);

    const MemoChildCommentsProfile = (childComment: FindAllMemoCommentMemoCommentResult) => (
        <>
            <div
                className="flex items-center space-x-1 cursor-default">
                <Avatar
                    className="w-6 h-6 rounded"
                    name={childComment.user?.username}
                    size="25"
                    round="3px"/>

                <div
                    className="text-sm sm:text-md racking-wider">{childComment.user?.username}</div>
            </div>

            <div
                className="text-xs text-gray-500 dark:text-gray-300">
                {timeSince(new Date(childComment.createdAt!))}
            </div>
        </>
    )

    const MemoChildCommentsSettingButton = (childComment: FindAllMemoCommentMemoCommentResult) => {
        return (
            <Menubar className="border-none bg-transparent hover:bg-background cursor-pointer h-fit w-fit">
                <MenubarMenu>
                    <MenubarTrigger
                        className="group inline-flex px-1 py-1 items-center justify-center rounded-md cursor-pointer">
                        <IoIosMore className="w-5 h-5"/>
                    </MenubarTrigger>

                    <MenubarContent sideOffset={10} align="end" className="min-w-[7px] dark:bg-neutral-700 border-none">
                        {/* 수정 */}
                        <MenubarItem className="p-0">
                            <Button
                                disabled={childComment.deleted}
                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                onClick={() => {
                                    openModal({
                                        name: ModalTypes.MEMO_COMMENT_UPDATE,
                                        data: {
                                            memoId: memoId,
                                            comment: childComment,
                                        }
                                    });
                                }}
                            >
                                <RiEditLine className="w-[18px] h-[18px]"/>
                                <div className="ml-1 text-sm pr-1">수정</div>
                            </Button>
                        </MenubarItem>

                        {/* 삭제 */}
                        <MenubarItem className="p-0">
                            <Button
                                disabled={childComment.deleted}
                                className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                onClick={() => {
                                    openModal({
                                        name: ModalTypes.MEMO_COMMENT_DELETE,
                                        data: {
                                            memoId: memoId,
                                            commentId: childComment.id,
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
        <div
            style={{maxHeight: dynamicHeight, height: "auto"}}
            className="bg-gray-50 dark:bg-black/20 transition-all duration-700 ease-in-out overflow-y-auto">

            {/* 답글이 있다면 */}
            {comment.childMemoComments?.length !== 0 &&
                <div className="flex-1 flex flex-col bg-transparent px-7">

                    {/* 답글 조회 */}
                    {comment.childMemoComments?.map((childComment, index) => {
                        return (
                            <div key={index}>
                                <div className="flex justify-between pt-6">
                                    {/* 프로필 */}
                                    <div className="flex items-center space-x-2">
                                        {MemoChildCommentsProfile(childComment)}
                                    </div>

                                    {/* 설정 버튼 */}
                                    <div className="flex">
                                        {isLogined && user_info?.id === childComment.user?.id &&
                                            MemoChildCommentsSettingButton(childComment)
                                        }
                                    </div>
                                </div>

                                <div className="py-6 border-b">{childComment.content}</div>
                            </div>
                        )
                    })}

                    {/* 답글 남기기 설명 */}
                    <>
                        {/* 로그인 상태 */}
                        <>
                            {isLogined && !comment.deleted &&
                                <div
                                    className="flex flex-col justify-center items-center text-gray-400 space-y-2 py-9">
                                    <div className="flex items-center space-x-1">
                                        <div className="text-[15px]">다양한 의견을 나누어보세요!</div>
                                    </div>

                                    {/* 답글 남기기 */}
                                    <MemoCreateChildCommentButton memoId={memoId!}
                                                                  commentId={comment.id!}
                                                                  commentDeleted={comment.deleted!}/>
                                </div>
                            }

                            {isLogined && comment.deleted &&
                                <div className="flex flex-col items-center text-gray-400">
                                    <div className="flex items-center space-x-1 py-9">
                                        <div className="text-[15px]">삭제된 댓글에는 답글을 남길 수 없어요</div>
                                        <BsEmojiTear className="w-5 h-5"/>
                                    </div>
                                </div>
                            }
                        </>

                        {/* 로그아웃 상태 */}
                        {!isLogined &&
                            <div className="flex flex-col items-center text-gray-400">
                                <div className="flex items-center space-x-1 py-9">
                                    <div className="text-[15px]">답글을 남기시려면 로그인 후 이용해주세요!</div>
                                </div>
                            </div>
                        }
                    </>
                </div>
            }

            {/* 로그인 상태 && 답글이 없다면 */}
            {isLogined && comment.childMemoComments?.length === 0 &&
                <>
                    {!comment.deleted &&
                        <div className="flex flex-col h-full justify-center items-center text-gray-400 space-y-2 py-6">
                            <div className="flex items-center space-x-1">
                                <div className="text-[15px]">다양한 의견을 나누어보세요!</div>
                            </div>

                            {/* 답글 남기기 */}
                            <MemoCreateChildCommentButton memoId={memoId!}
                                                          commentId={comment.id!}
                                                          commentDeleted={comment.deleted!}/>
                        </div>
                    }

                    {comment.deleted &&
                        <div className="flex flex-col h-full justify-center items-center text-gray-400">
                            <div className="flex items-center space-x-1 py-9">
                                <div className="text-[15px]">삭제된 댓글에는 답글을 남길 수 없어요</div>
                                <BsEmojiTear className="w-5 h-5"/>
                            </div>
                        </div>
                    }
                </>
            }

            {/* 로그아웃 상태 */}
            {!isLogined && comment.childMemoComments?.length === 0 &&
                <div className="flex flex-col h-full justify-center items-center text-gray-400">
                    <div className="flex items-center space-x-1 py-9">
                        <div className="text-[15px]">답글을 남기시려면 로그인 후 이용해주세요!</div>
                    </div>
                </div>
            }
        </div>
    )
}

export default MemoChildComments;