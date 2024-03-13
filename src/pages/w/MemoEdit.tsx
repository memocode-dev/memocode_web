import MemoVersions from "@/components/memos/toolbar/MemoVersions.tsx";
import MonacoEditor from "@/components/common/MonacoEditor.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useFindAllMemo, useFindMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import InternalError from "@/components/common/InternalError.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalConext.tsx";
import {MemoUpdateForm} from "@/openapi/memo/model";
import {toast} from "react-toastify";
import MemoPreview from "@/components/memos/MemoPreview.tsx";

const MemoEdit = () => {

    const {memoId} = useParams();
    const {openModal} = useContext(ModalContext)
    const {theme} = useContext(ThemeContext);
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

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

    const onUpdateSubmit = (data: MemoUpdateForm) => {
        updateMemo({
            memoId: memoId!,
            data: data,
        })
    }

    const {refetch: refetchMemos} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

    const {mutate: updateMemo} = useUpdateMemo({
        mutation: {
            onSuccess: () => {
                toast.success("메모가 수정되었습니다.")
                refetchMemos();
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

    useEffect(() => {
        if (memo) {
            reset({
                title: memo.title,
                content: memo.content
            })
        }
    }, [memo]);

    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    return (
        <>
            <div ref={divRef} className="flex-1 flex flex-col pt-14 bg-white dark:bg-[#1E1E1E] relative">
                <MemoPreview content={watch("content")}/>
                {!isLoading &&
                    <div className="flex-1 flex flex-col relative ">
                        <div className="flex space-x-4 mx-auto w-full max-w-[968px]">
                            <Button
                                onClick={() => {
                                    openModal({
                                        name: ModalTypes.MEMO_VERSIONS,
                                    })
                                }}
                            >
                                메모버전
                            </Button>
                            <Button onClick={() => onUpdateSubmit(watch())}>저장</Button>
                            <Button onClick={() => openModal({
                                name: ModalTypes.MEMO_PREVIEW,
                            })}>미리보기</Button>
                        </div>
                        {/* title */}
                        <div className="my-2 p-2 w-full max-w-[968px] bg-[#fdfdfd] dark:bg-[#1E1E1E] mx-auto">

                            <textarea
                                {...register("title")}
                                className="text-2xl bg-[#fdfdfd] dark:bg-[#1E1E1E] placeholder-gray-300 focus:outline-none"
                                placeholder="제목 없음"
                                style={{
                                    width: '100%',
                                    overflow: 'hidden',
                                    resize: 'none',
                                }}
                            />
                        </div>

                        {/* content */}
                        <div className="flex-1 flex bg-[#fdfdfd] flex-col">
                            <MonacoEditor
                                width={`${width - 300}px`}
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


            {/* 미리보기 버튼 */}
            {/*<ToolBarPreview isPreview={isPreview} setIsPreview={setIsPreview} sidebarWidth={sidebarWidth}/>*/}

            {/* 메모 버전 생성 및 리스트 버튼 */}


            {/* 이미지 업로드 버튼 */}
            {/*<div*/}
            {/*    style={{marginLeft: `${sidebarWidth}px`}}*/}
            {/*    className="fixed left-0 top-2 flex items-center space-x-2 z-[60]">*/}
            {/*    <div className="ml-40">*/}
            {/*        <MemoToolBarMenu handler={codeMirrorAddContentHandler} memoId={memoId}/>*/}
            {/*    </div>*/}
            {/*</div>*/}


            <MemoVersions/>
        </>
    );

}

export default MemoEdit;