import {Button} from "@/components/ui/button.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {IoDocuments, IoFileTrayFull} from "react-icons/io5";
import {VscOpenPreview} from "react-icons/vsc";
import {IoIosSave} from "react-icons/io";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useParams} from "react-router-dom";
import {useFindAllMemo, useFindMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";
import {useCreateMemoVersion, useFindAllMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import {MemoUpdateForm} from "@/openapi/memo/model";
import {useFormContext} from "react-hook-form";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu.tsx";
import {TbArticle, TbArticleOff} from "react-icons/tb";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {FaLock, FaUnlock} from "react-icons/fa";

const MemoToolbar = () => {

    const {memoId} = useParams();
    const {openModal} = useContext(ModalContext)
    const {logout, user_info} = useContext(UserContext)
    const {watch} = useFormContext()

    const [hoverVisibility, setHoverVisibility] = useState<boolean>(false)

    /* 메모버전 추가 전 메모 저장 */
    const {mutate: updateMemoBeforeCreateMemoVersion} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                createMemoVersion({memoId: memoId!})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요.")
            },
        }
    })

    /* 메모버전 추가 */
    const {mutate: createMemoVersion} = useCreateMemoVersion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모버전이 추가되었습니다.")
                await refetchMemoVersion();
                await refetchMemos();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    /* 메모버전 전체 조회 */
    const {refetch: refetchMemoVersion} =
        useFindAllMemoVersion(
            memoId!,
            {
                page: 0,
                size: 10,
            },
            {
                query: {
                    queryKey: ["memoVersions", memoId]
                }
            })

    /* 메모 전체 조회 */
    const {refetch: refetchMemos} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

    /* 메모 단건 조회 */
    const {refetch: refetchMemo, data: memo} = useFindMemo(memoId!, {
        query: {
            queryKey: ["MemoEdit", memoId!]
        }
    })

    /* 메모 공개/비공개 수정 */
    const {mutate: updateMemoVisibility} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 변경되었습니다.")
                await refetchMemo();
                await refetchMemos();
            },
            onError: (error) => {
                console.log(error)
                if (error?.response?.status === 400) {
                    toast.error("보안 설정된 메모는 블로그에 개시할 수 없습니다.");
                } else {
                    toast.error("관리자에게 문의하세요");
                }
            },
        }
    })

    /* 메모 수정 */
    const {mutate: updateMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모가 수정되었습니다.")
                await refetchMemos();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요.")
            },
        }
    })

    const onUpdateSubmit = (data: MemoUpdateForm) => {
        updateMemo({
            memoId: memoId!,
            data: data,
        })
    }

    const handleMemoVersionCreate = () => {
        updateMemoBeforeCreateMemoVersion({
            memoId: memoId!,
            data: {
                title: watch("title"),
                content: watch("content")
            },
        })
    }

    const handleVisibility = () => {
        updateMemoVisibility({
            memoId: memoId!,
            data: {
                visibility: !watch("visibility"),
            },
        })
    }

    return (
        <div className="flex h-20 fixed top-1 right-2 justify-end w-full p-1.5">
            <div className="flex space-x-1">

                {memo?.security ?
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1.5 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5">
                                    <FaLock className="w-5 h-5"/>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>보안 활성화</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    : <></>}

                {/* 공개/비공개 버튼 */}
                <div
                    onClick={handleVisibility}
                    className={`w-16 h-9 flex items-center rounded px-[3px] cursor-pointer bg-gray-200 dark:bg-black
                     ${watch("visibility") ? 'justify-end' : 'justify-start'}
                     `}
                >
                    <div className="rounded flex justify-center items-center">
                        {watch("visibility") ? (
                            <>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="flex justify-start items-center w-7 h-7 bg-transparent rounded"
                                                onMouseOver={() => {
                                                    setHoverVisibility(true)
                                                }}
                                                onMouseLeave={() => {
                                                    setHoverVisibility(false)
                                                }}
                                                onClick={() => {
                                                    // toggle(() => false)
                                                    setHoverVisibility(false)
                                                }}
                                            >
                                                <TbArticleOff className="text-gray-800 dark:text-gray-200 w-5 h-5"/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                            <p>블로그 비공개</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                <div
                                                    className={`flex justify-center items-center w-7 h-7 bg-white dark:bg-neutral-700 rounded transform transition duration-300 scale-left ${hoverVisibility ? 'scale-x-125' : 'scale-x-100'}`}
                                                >
                                                </div>
                                                <TbArticle
                                                    className="absolute top-1 left-1 w-5 h-5 text-gray-800 dark:text-gray-200"/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                            <p>블로그 공개</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        ) : (
                            <>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                <div
                                                    className={`flex justify-center items-center w-7 h-7 bg-white dark:bg-neutral-700 rounded transform transition duration-300 scale-right ${hoverVisibility ? 'scale-x-125 ' : 'scale-x-100'}`}
                                                >
                                                </div>
                                                <TbArticleOff
                                                    className="absolute top-1 left-1 text-gray-800 dark:text-gray-200 w-5 h-5"/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                            <p>블로그 비공개</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className="flex justify-end items-center w-7 h-7 bg-transparent rounded"
                                                onMouseOver={() => {
                                                    setHoverVisibility(true)

                                                }}
                                                onMouseLeave={() => {
                                                    setHoverVisibility(false)
                                                }}
                                                onClick={() => {
                                                    // toggle(() => true)
                                                    setHoverVisibility(false)
                                                }}
                                            >
                                                <TbArticle className="w-5 h-5 text-gray-800 dark:text-gray-200"/>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                            <p>블로그 공개</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </>
                        )}
                    </div>
                </div>

                {/* 미리보기 버튼 */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 w-8 h-8 p-1 rounded text-gray-800 dark:text-gray-300 mt-0.5"
                                onClick={() => openModal({
                                    name: ModalTypes.MEMO_PREVIEW,
                                })}>
                                <VscOpenPreview className="w-[22px] h-[22px] mt-0.5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                            <p>미리보기</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* 저장 */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                onClick={() => onUpdateSubmit(watch())}>
                                <IoIosSave className="w-6 h-6"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                            <p>저장</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <NavigationMenu className="items-start mb-[2.3rem] mt-0.5">
                    <NavigationMenuList>
                        <NavigationMenuItem
                            className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-0.5">
                            <NavigationMenuTrigger className="flex">메모 관리</NavigationMenuTrigger>
                            <NavigationMenuContent
                                className="bg-white shadow-lg dark:bg-neutral-700 p-1">

                                {/* 메모 버전 관리 버튼 */}
                                <NavigationMenuLink className="flex flex-1 flex-col">
                                    <Button
                                        className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                        onClick={() => {
                                            openModal({
                                                name: ModalTypes.MEMO_VERSIONS,
                                                data: {
                                                    memoId: memoId,
                                                }
                                            })
                                        }}
                                    >
                                        <IoFileTrayFull className="w-[18px] h-[18px]"/>
                                        <div className="ml-1 text-sm">버전 관리</div>
                                    </Button>
                                </NavigationMenuLink>

                                {/* 메모 버전 추가 버튼 */}
                                <NavigationMenuLink>
                                    <Button
                                        className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                        onClick={handleMemoVersionCreate}>
                                        <IoDocuments className="w-[18px] h-[18px]"/>
                                        <div className="ml-1 text-sm">버전 추가</div>
                                    </Button>
                                </NavigationMenuLink>

                                {/* 메모 보안 버튼 */}
                                <NavigationMenuLink>
                                    <Button
                                        className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                        onClick={() => {
                                            openModal({
                                                name: ModalTypes.MEMO_SECURITY,
                                                data: {
                                                    memoId: memoId
                                                }
                                            })
                                        }}
                                    >
                                        <FaUnlock className="w-[17px] h-[17px]"/>
                                        <div className="ml-1 text-sm">보안 설정</div>
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* 프로필 */}
                <NavigationMenu className="items-start mb-[2.3rem] mt-0.5">
                    <NavigationMenuList>
                        <NavigationMenuItem
                            className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-0.5">
                            <NavigationMenuTrigger className="hidden">
                                <div className="flex items-center space-x-1.5">
                                    <div className="text-sm">{user_info.nickname}</div>
                                    <div
                                        className="cursor-pointer p-0 focus:bg-transparent data-[state=open]:bg-transparent">
                                        <Avatar className="w-5 h-5 rounded">
                                            <AvatarImage src="https://github.com/shadcn.png"/>
                                            <AvatarFallback>
                                                <Skeleton className="h-5 w-5 rounded"/>
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                </div>
                            </NavigationMenuTrigger>

                            <NavigationMenuContent
                                className="bg-white shadow-lg dark:bg-neutral-700 p-1 max-w-24">
                                <NavigationMenuLink className="flex flex-1 flex-col">
                                    <Button
                                        className="flex justify-start bg-transparent hover:bg-gray-100 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-full h-fit"
                                        onClick={logout}
                                    >
                                        <div className="ml-1 text-sm pr-1">로그아웃</div>
                                    </Button>
                                </NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}

export default MemoToolbar