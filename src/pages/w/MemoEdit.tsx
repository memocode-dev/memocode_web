import MonacoEditor from "@/components/common/MonacoEditor.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useFindAllMemo, useFindMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import InternalError from "@/components/common/InternalError.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {MemoUpdateForm} from "@/openapi/memo/model";
import {toast} from "react-toastify";
import MemoVersions from "@/components/memos/toolbar/menu/MemoVersions.tsx";
import MemoPreview from "@/components/memos/toolbar/menu/MemoPreview.tsx";
import MemoSecurity from "@/components/memos/toolbar/menu/MemoSecurity.tsx";
import MemoToolbar from "@/components/memos/toolbar/MemoToolbar.tsx";

const MemoEdit = () => {

    const {memoId} = useParams();
    const {theme} = useContext(ThemeContext);
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

    const memoFormMethod = useForm({
        defaultValues: {
            title: "",
            content: "",
            visibility: false,
            security: false
        },
    });

    {/* 메모 전체 조회 */
    }
    const {refetch: refetchMemos} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

    {/* 메모 단건 조회 */
    }
    const {isError, error, data: memo, refetch, isLoading} =
        useFindMemo(
            memoId!, {
                query: {
                    queryKey: ["MemoEdit", memoId!]
                }
            })


    {/* 메모 수정 */
    }
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

    useEffect(() => {
        if (memo) {
            memoFormMethod.reset({
                title: memo.title,
                content: memo.content,
                visibility: memo.visibility,
                security: memo.security
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
                <MemoPreview content={memoFormMethod.watch("content")}/>

                <div className="flex-1 flex bg-transparent">
                    {!isLoading &&
                        <div className="flex-1 flex flex-col relative items-center mt-20">

                            {/* toolbar */}
                            <FormProvider {...memoFormMethod}>
                                <MemoToolbar/>
                            </FormProvider>


                            {/* title */}
                            <div className="flex w-full max-w-[900px] my-2 bg-transparent">
                                <textarea
                                    {...memoFormMethod.register("title")}
                                    className="text-2xl py-2 px-6 bg-transparent placeholder-gray-300 focus:outline-none"
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
                                    onChange={(value) => memoFormMethod.setValue("content", value)}
                                    value={memoFormMethod.watch("content")}
                                    onKeyDown={(e) => {
                                        if (e.ctrlKey && e.code === "KeyS") {
                                            onUpdateSubmit(
                                                memoFormMethod.watch()
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
            <MemoSecurity/>
        </>
    )
}

export default MemoEdit;