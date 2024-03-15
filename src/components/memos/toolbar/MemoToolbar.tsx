import {Button} from "@/components/ui/button.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalConext.tsx";
import {IoDocumentLock, IoDocuments, IoFileTrayFull} from "react-icons/io5";
import {Switch} from "@/components/ui/switch.tsx";
import {VscOpenPreview} from "react-icons/vsc";
import {IoIosSave} from "react-icons/io";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useParams} from "react-router-dom";
import {useFindAllMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";
import {useCreateMemoVersion, useFindAllMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import {MemoUpdateForm} from "@/openapi/memo/model";
import {useForm} from "react-hook-form";

const MemoToolbar = () => {

    const {memoId} = useParams();
    const {openModal} = useContext(ModalContext)
    const {logout, user_info} = useContext(UserContext)
    const [isToggled, setIsToggled] = useState<boolean>(false);

    const {
        watch,
        register,
    } = useForm({
        defaultValues: {
            title: "",
            content: "",
            security: false,
            visibility: false
        },
    });

    {/* 메모버전 추가 전 메모 저장 */}
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

    {/* 메모버전 추가 */}
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

    {/* 메모버전 전체 조회 */}
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

    {/* 메모 전체 조회 */}
    const {refetch: refetchMemos} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

    {/* 메모 공개/비공개 수정 */}
    const {mutate: updateMemoVisibility} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 변경되었습니다.")
                await refetchMemos();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요.")
            },
        }
    })

    {/* 메모 수정 */}
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
            data: watch(),
        })
    }

    const handleVisibility = () => {
        setIsToggled(pre => !pre)

        if (!isToggled) {
            console.log("공개 요청날리기")
            updateMemoVisibility({
                memoId: memoId!,
                data: {
                    visibility: isToggled
                },
            })
        } else {
            console.log("비공개 요청날리기")
            updateMemoVisibility({
                memoId: memoId!,
                data: {
                    visibility: isToggled
                },
            })
        }
    }

    return (
        <div className="flex justify-end w-full p-1">
            <div className="flex space-x-2">
                <Button
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit"
                    onClick={() => {
                        openModal({
                            name: ModalTypes.MEMO_VERSIONS,
                            data: {
                                memoId: memoId,
                            }
                        })
                    }}
                >
                    <IoFileTrayFull className="w-6 h-6"/>
                </Button>

                {/* 메모 버전 추가 버튼 */}
                <Button
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit"
                    onClick={handleMemoVersionCreate}>
                    <IoDocuments className="w-6 h-6"/>
                </Button>

                {/* 메모 보안 버튼 */}
                <Button
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit"
                    onClick={() => {
                        openModal({
                            name: ModalTypes.MEMO_SECURITY,
                            data: {
                                memoId: memoId,
                            }
                        })
                    }}
                >
                    <IoDocumentLock className="w-6 h-6"/>
                </Button>

                {/* 공개/비공개 버튼 */}
                <div className="flex flex-1">
                    <div className="flex flex-1 flex-col w-20 h-28">
                        <Switch
                            className="thumb"
                            id="visibility"
                            onClick={handleVisibility}
                            checked={isToggled}
                            {...register("visibility")}
                        />
                        {/*<Label htmlFor="visibility">공개/비공개</Label>*/}
                    </div>
                </div>

                {/* 미리보기 버튼 */}
                <Button
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit"
                    onClick={() => openModal({
                        name: ModalTypes.MEMO_PREVIEW,
                    })}>
                    <VscOpenPreview className="w-6 h-6"/>
                </Button>

                {/* 저장 */}
                <Button
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-black p-1 rounded text-gray-800 dark:text-gray-300 w-fit h-fit"
                    onClick={() => onUpdateSubmit(watch())}>
                    <IoIosSave className="w-6 h-6"/>
                </Button>
            </div>


            {/* 프로필 */}
            <div>
                {user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS" || user_info.username === "" ?
                    <></>
                    :
                    <Menubar className="border-none bg-transparent">
                        <MenubarMenu>
                            <div className="text-sm">{user_info.nickname}</div>

                            <MenubarTrigger
                                className="cursor-pointer p-0 bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                                <Avatar className="hover:animate-headShake w-7 h-7 rounded">
                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                    <AvatarFallback>
                                        <Skeleton className="h-7 w-7 rounded"/>
                                    </AvatarFallback>
                                </Avatar>
                            </MenubarTrigger>
                            <MenubarContent className="fixed -left-11 top-2 min-w-[7rem] z-[1000]">
                                <MenubarItem onClick={logout}>로그아웃</MenubarItem>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                }
            </div>
        </div>
    )
}

export default MemoToolbar