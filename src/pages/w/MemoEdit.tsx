import MonacoEditor from "@/components/common/MonacoEditor.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useFindAllMemo, useFindMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import InternalError from "@/components/common/InternalError.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MemoUpdateForm} from "@/openapi/memo/model";
import {toast} from "react-toastify";
import {ModalContext, ModalTypes} from "@/context/ModalConext.tsx";
import {useCreateMemoVersion, useFindAllMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import MemoPreview from "@/components/memos/edit/MemoPreview.tsx";
import MemoVersions from "@/components/memos/edit/MemoVersions.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import UserContext from "@/context/UserContext.tsx";

const MemoEdit = () => {

    const {memoId} = useParams();
    const {theme} = useContext(ThemeContext);
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const {openModal} = useContext(ModalContext)
    const {logout, user_info} = useContext(UserContext)

    const {
        watch,
        register,
        reset,
        setValue
    } = useForm({
        defaultValues: {
            title: "",
            content: ""
        },
    });

    const {refetch: refetchMemos} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

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

    const {isError, error, data: memo, refetch, isLoading} =
        useFindMemo(
            memoId!, {
                query: {
                    queryKey: ["MemoEdit", memoId!]
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

    useEffect(() => {
        if (memo) {
            reset({
                title: memo.title,
                content: memo.content
            })
        }
    }, [memo]);

    useEffect(() => {
        const handleResize = (entries: ResizeObserverEntry[]) => {
            const entry = entries[0];
            setWidth(entry.contentRect.width);
        };

        if (divRef.current) {
            const observer = new ResizeObserver(handleResize);
            observer.observe(document.body);

            // 컴포넌트가 언마운트될 때 observer를 정리합니다.
            return () => observer.disconnect();
        }
    }, []);

    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    return (
        <>

            <div ref={divRef} className="flex-1 flex flex-col bg-white dark:bg-[#1E1E1E] relative">
                <MemoPreview content={watch("content")}/>

                <div className="flex-1 flex bg-transparent">

                    {!isLoading &&
                        <div className="flex-1 flex flex-col relative items-center">
                            <div className="flex justify-between w-full px-10">
                                <div className="space-x-2">
                                    <Button
                                        className="p-1 hover:bg-gray-100 rounded"
                                        onClick={() => {
                                            openModal({
                                                name: ModalTypes.MEMO_VERSIONS,
                                                data: {
                                                    memoId: memoId,
                                                }
                                            })
                                        }}
                                    >
                                        메모버전관리
                                    </Button>

                                    {/* 메모 버전 추가 버튼 */}
                                    <Button onClick={handleMemoVersionCreate}>메모버전추가</Button>

                                    {/* 공개/비공개 버튼 */}
                                    <Button>공개비공개</Button>

                                    {/* 미리보기 버튼 */}
                                    <Button onClick={() => openModal({
                                        name: ModalTypes.MEMO_PREVIEW,
                                    })}>미리보기</Button>

                                    {/* 저장 */}
                                    <Button onClick={() => onUpdateSubmit(watch())}>저장</Button>
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

                            {/* title */}
                            <div className="flex w-full max-w-[900px] my-2 bg-transparent">
                                <textarea
                                    {...register("title")}
                                    className="text-2xl py-2 px-6 bg-transparent placeholder-gray-300 focus:outline-none"
                                    placeholder="제목 없음"
                                    style={{
                                        width: `${width}px`,
                                        height: "100%",
                                        overflow: 'hidden',
                                        resize: 'none',
                                    }}
                                />
                            </div>

                            {/* content */}
                            <div className="flex flex-1 w-full max-w-[900px]">
                                <MonacoEditor
                                    width={`${width}px`}
                                    height="100%"
                                    language="markdown"
                                    theme={theme === "light" ? "vs" : "vs-dark"}
                                    onChange={(value) => setValue("content", value)}
                                    value={watch("content")}
                                    onKeyDown={(e) => {
                                        if (e.ctrlKey && e.code === "KeyS") {
                                            onUpdateSubmit(
                                                watch()
                                            )
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>

            <MemoVersions/>
        </>
    )
}

export default MemoEdit;