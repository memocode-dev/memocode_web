'use client'

import {Button} from "@/components/ui/button";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {IoDocuments, IoFileTrayFull} from "react-icons/io5";
import {VscOpenPreview} from "react-icons/vsc";
import {IoIosMore, IoIosSave, IoMdInformationCircle} from "react-icons/io";
import {ChangeEvent, useContext, useState} from "react";
import {Bounce, toast} from "react-toastify";
import {TbArticle, TbArticleOff} from "react-icons/tb";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import { FaLock, FaRegStar, FaStar, FaUnlock} from "react-icons/fa";
import {MemoContext} from "@/context/MemoContext";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar";
import {ChevronDown} from "lucide-react";
import {useKeycloak} from "@/context/KeycloakContext";
import {useCreateMemoVersion, useUpdateMemo} from "@/openapi/api/memos/memos";
import {BsImage} from "react-icons/bs";
import {useTheme} from "@/context/ThemeContext";
import MyMemoVersionModal from "@/components/page_components/myMemo/toolbar/MyMemoVersionModal";
import MyMemoVersionsModal from "@/components/page_components/myMemo/toolbar/MyMemoVersionsModal";
import MyMemoDeleteVersionModal from "@/components/page_components/myMemo/toolbar/MyMemoDeleteVersionModal";
import MyMemoSecurityModal from "@/components/page_components/myMemo/toolbar/MyMemoSecurityModal";
import MyMemoUpdateDetailInfoModal from "@/components/page_components/myMemo/toolbar/MyMemoUpdateDetailInfoModal";
import {LiaDoorOpenSolid} from "react-icons/lia";

interface MemoEditPageProps {
    onUpdateMemoSubmit: () => void;
    onChangeImageIconInput: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MyMemoToolbar = ({onUpdateMemoSubmit, onChangeImageIconInput}: MemoEditPageProps) => {

    const {theme} = useTheme()
    const [hoverVisibility, setHoverVisibility] = useState<boolean>(false);
    const {
        findAllMyMemo,
        memoId,
        findMyMemo,
        findAllMyMemoVersion,
    } = useContext(MemoContext);
    const {openModal} = useContext(ModalContext);
    const {logout} = useKeycloak();

    /* 메모버전 추가 */
    const {mutate: createMemoVersion} = useCreateMemoVersion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모버전이 추가되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await findAllMyMemoVersion.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            }
        }
    })

    /* 메모 공개/비공개 수정 */
    const {mutate: updateMemoVisibility} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 변경되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                const response = error?.response?.status;
                const errorMsg1 = "보안 설정된 메모는 블로그에 개시할 수 없습니다."
                const errorMsg2 = "관리자에게 문의하세요"
                toast.error(() => {
                    if (response === 400) {
                        return errorMsg1;
                    } else {
                        return errorMsg2;
                    }
                }, {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            },
        }
    })

    /* 메모 즐겨찾기 수정 */
    const {mutate: updateMemoBookmarked} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 즐겨찾기가 변경되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            },
        }
    })

    const handleVisibility = () => {
        updateMemoVisibility({
            memoId: memoId!,
            data: {
                visibility: !findMyMemo.data?.visibility,
            },
        })
    }

    const handleBookmarked = () => {
        updateMemoBookmarked({
            memoId: memoId!,
            data: {
                bookmarked: !findMyMemo.data?.bookmarked,
            },
        })
    }

    const handleImageUpload = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

    const MyMemoVersionManagementButton = (
        <MenubarItem className="p-0">
            <Button
                className="flex justify-start bg-transparent text-foreground hover:bg-secondary dark:hover:bg-secondary-hover px-2 py-1.5 rounded w-full h-fit"
                onClick={() => {
                    openModal({
                        name: ModalTypes.MY_MEMO_VERSIONS,
                        data:{
                            memoId: memoId,
                        }
                    })
                }}
            >
                <IoFileTrayFull className="w-[18px] h-[18px]"/>
                <div className="ml-1 text-sm">버전 관리</div>
            </Button>
        </MenubarItem>
    )

    const MyMemoVersionAddButton = (
        <MenubarItem className="p-0">
            <Button
                className="flex justify-start bg-transparent text-foreground hover:bg-secondary dark:hover:bg-secondary-hover px-2 py-1.5 rounded w-full h-fit"
                onClick={() => createMemoVersion({memoId: memoId!})}>
                <IoDocuments className="w-[18px] h-[18px]"/>
                <div className="ml-1 text-sm">버전 추가</div>
            </Button>
        </MenubarItem>
    )

    const MyMemoSecurityButton = (
        <MenubarItem disabled={!!findMyMemo.data?.security}
                     className="p-0">
            <Button
                className="flex justify-start bg-transparent text-foreground hover:bg-secondary dark:hover:bg-secondary-hover px-2 py-1.5 rounded w-full h-fit"
                onClick={() => {
                    openModal({
                        name: ModalTypes.MY_MEMO_SECURITY,
                    })
                }}
            >
                <FaUnlock className="w-[16px] h-[16px]"/>
                <div className="ml-1.5 text-sm">보안 설정</div>
            </Button>
        </MenubarItem>
    )

    const MyMemoVisibilityButton = (
        <MenubarItem className="pt-1.5 py-0">
            {!findMyMemo.data?.security && <div
                onClick={handleVisibility}
                className={`w-16 h-9 flex items-center rounded px-[3px] cursor-pointer bg-gray-200 dark:bg-black
                    ${findMyMemo.data?.visibility ? 'justify-end' : 'justify-start'}
                    `}
            >
                <div className="rounded flex justify-center items-center">
                    {findMyMemo.data?.visibility ? (
                        <>
                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
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
                                                setHoverVisibility(false)
                                            }}
                                        >
                                            <TbArticleOff
                                                className="text-gray-800 dark:text-gray-200 w-5 h-5"/>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                        <p>블로그 비공개</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip delayDuration={100}>
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
                                <Tooltip delayDuration={100}>
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
                                <Tooltip delayDuration={100}>
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
                                                setHoverVisibility(false)
                                            }}
                                        >
                                            <TbArticle
                                                className="w-5 h-5 text-gray-800 dark:text-gray-200"/>
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
            }
        </MenubarItem>
    )

    return (
        <>
            <div className="flex w-full h-12 fixed top-1 right-2 justify-end p-1.5">
                <div className="flex space-x-1">

                    {/* 이미지 업로드 */}
                    <>
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1.5 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                        onClick={handleImageUpload}
                                    >
                                        <BsImage className="bg-transparent w-5 h-5"/>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                    className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                    <p>이미지 업로드</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept=".jpeg,.jpg,.gif,.png"
                            onChange={onChangeImageIconInput}
                        />
                    </>

                    {/* 메모 즐겨찾기 */}
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1.5 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                    onClick={handleBookmarked}
                                >
                                    {findMyMemo.data?.bookmarked ?
                                        <FaStar className="fill-yellow-400 stroke-yellow-400 w-5 h-5"/>
                                        :
                                        <FaRegStar className="bg-transparent w-5 h-5"/>
                                    }

                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>즐겨찾는 메모</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* 메모 상세정보 */}
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                    onClick={() => {
                                        openModal({
                                            name: ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO,
                                            data: {
                                                createNewMemo: false
                                            }
                                        })
                                    }}>
                                    <IoMdInformationCircle className="w-6 h-6"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>메모 상세정보</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* 미리보기 버튼 */}
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 w-8 h-8 p-1 rounded text-gray-800 dark:text-gray-300 mt-0.5"
                                    onClick={() => openModal({
                                        name: ModalTypes.MY_MEMO_PREVIEW,
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
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit mt-0.5"
                                    onClick={onUpdateMemoSubmit}>
                                    <IoIosSave className="w-6 h-6"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>저장</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                    {/* 보안 활성화된 메모 */}
                    {findMyMemo.data?.security &&
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
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
                    }


                    {/* 메모 관리 / 설정 */}
                    <Menubar
                        className="border-0 h-fit mt-0.5 p-0 bg-transparent cursor-pointer">

                        <div className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-0.5">
                            <MenubarMenu>
                                <MenubarTrigger
                                    className="group inline-flex p-1 h-fit w-max items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-neutral hover:text-accent-foreground focus:bg-neutral focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-neutral/50 data-[state=open]:bg-neutral/50 cursor-pointer">
                                    메모 관리
                                    <ChevronDown
                                        className={`flex relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180`}
                                        aria-hidden="true"
                                    />
                                </MenubarTrigger>

                                <MenubarContent
                                    className="min-w-[8rem] mr-[50px] space-y-7 py-2">

                                    {/* 메모 관리 */}
                                    <div>
                                        <div
                                            className="px-2 pb-1 text-xs text-gray-500 dark:text-gray-300 cursor-default">버전
                                        </div>

                                        {/* 메모 버전 관리 버튼 */}
                                        {MyMemoVersionManagementButton}

                                        {/* 메모 버전 추가 버튼 */}
                                        {MyMemoVersionAddButton}
                                    </div>

                                    {/* 메모 보안 버튼 */}
                                    <div>
                                        <div
                                            className="px-2 pb-1 text-xs text-gray-500 dark:text-gray-300 cursor-default">보안
                                        </div>

                                        {MyMemoSecurityButton}
                                    </div>

                                    {/* 공개/비공개 버튼 */}
                                    <div>
                                        <div
                                            className="px-2 pb-1.5 text-xs text-gray-500 dark:text-gray-300 cursor-default">
                                            블로그 공개 여부
                                        </div>

                                        {MyMemoVisibilityButton}
                                    </div>
                                </MenubarContent>
                            </MenubarMenu>
                        </div>

                        {/* 설정 */}
                        <div
                            className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 p-0.5 cursor-pointer">
                            <MenubarMenu>
                                <MenubarTrigger
                                    className="group inline-flex p-1 h-fit w-max items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-neutral hover:text-accent-foreground focus:bg-neutral focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-neutral/50 data-[state=open]:bg-neutral/50 cursor-pointer">
                                    <IoIosMore className="w-5 h-5"/>
                                </MenubarTrigger>

                                <MenubarContent className="min-w-[7px] mr-3.5">
                                    {/* 로그아웃 */}
                                    <MenubarItem className="p-0">
                                        <Button
                                            className="flex justify-start bg-transparent text-foreground hover:bg-secondary dark:hover:bg-secondary-hover p-1 rounded w-full h-fit"
                                            onClick={logout}
                                        >
                                            <LiaDoorOpenSolid className="w-[23px] h-[23px]"/>
                                            <div className="ml-1 text-sm pr-1">로그아웃</div>
                                        </Button>
                                    </MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </div>
                    </Menubar>
                </div>
            </div>

            {/* 메모 편집 페이지 안에서 표시되어야 해서 여기에 둠 */}
            <MyMemoVersionsModal/>
            <MyMemoVersionModal/>
            <MyMemoDeleteVersionModal/>
            <MyMemoSecurityModal/>
            <MyMemoUpdateDetailInfoModal/>
        </>
    )
}

export default MyMemoToolbar