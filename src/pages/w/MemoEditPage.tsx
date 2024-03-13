import ToolBarMemoVersion from "@/components/memos/toolbar/ToolBarMemoVersion.tsx";
import MonacoEditor from "@/components/common/MonacoEditor.tsx";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useFindMemo} from "@/openapi/memo/api/memos/memos.ts";
import InternalError from "@/components/common/InternalError.tsx";

const MemoEditPage = () => {

    const sidebarWidth = 300;
    const {memoId} = useParams();

    const [theme, setTheme] = useState(false)
    const [newMemoId, setNewMemoId] = useState("")

    const {
        register,
        reset,
        setValue
    } = useForm({
        defaultValues: {
            saveTitle: "",
            saveContent: ""
        },
    });

    const setTitleHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue("saveTitle", e.target.value)
    }

    const {isError, error, data: memo, refetch} =
        useFindMemo(
            newMemoId, {
                query: {
                    queryKey: ["MemoEditPage"]
                }
            })

    // 비동기적 변화 감지 - handleTheme
    useEffect(() => {
        const htmlEl = document.querySelector('html');

        if (!htmlEl) return;

        // 변화를 감지할 콜백 함수
        const callback: MutationCallback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (htmlEl.classList.contains('dark')) {
                        setTheme(true)
                    } else {
                        setTheme(false)
                    }
                }
            }
        };

        // MutationObserver 인스턴스 생성
        const observer = new MutationObserver(callback);

        // HTML 태그의 클래스 목록 변화 감시 시작
        observer.observe(htmlEl, {attributes: true});

        // 컴포넌트 언마운트 시 옵저버 연결 해제
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (memoId !== undefined) {
            setNewMemoId(memoId)
        } else {
            setNewMemoId("")
        }
    }, [memoId]);

    useEffect(() => {
        if (memo) {
            console.log("memo", memo)
            reset({
                saveTitle: memo?.title || "",
                saveContent: memo?.content || "",
            });
        } else {
            reset()
        }
    }, [memo]);

    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    return (
        <>{memoId && <>
            <div className="flex-1 flex flex-col pt-14 overflow-y-auto bg-white dark:bg-[#1E1E1E]">

                {/* title */}
                <div className="my-2 p-2 w-full max-w-[968px] bg-[#fdfdfd] dark:bg-[#1E1E1E] mx-auto">
                   <textarea
                       {...register("saveTitle")}
                       className="text-2xl bg-[#fdfdfd] dark:bg-[#1E1E1E] placeholder-gray-300 focus:outline-none"
                       placeholder="제목 없음"
                       onChange={setTitleHandler}
                       style={{
                           width: '100%',
                           overflow: 'hidden',
                           resize: 'none',
                       }}
                   />
                </div>

                {/* content */}
                <div className="flex-1 flex mx-auto w-full max-w-[968px] bg-[#fdfdfd] mb-24 flex-col">
                    <MonacoEditor
                        language="markdown"
                        theme={theme ? "vs-dark" : "vs"}
                        onChange={(value) => setValue("saveContent", value)}
                        value={memo?.content}
                    />
                </div>
            </div>


            {/* 미리보기 버튼 */}
            {/*<ToolBarPreview isPreview={isPreview} setIsPreview={setIsPreview} sidebarWidth={sidebarWidth}/>*/}

            {/* 메모 버전 생성 및 리스트 버튼 */}
            <ToolBarMemoVersion sidebarOpen={true} sidebarWidth={sidebarWidth}/>

            {/* 이미지 업로드 버튼 */}
            {/*<div*/}
            {/*    style={{marginLeft: `${sidebarWidth}px`}}*/}
            {/*    className="fixed left-0 top-2 flex items-center space-x-2 z-[60]">*/}
            {/*    <div className="ml-40">*/}
            {/*        <MemoToolBarMenu handler={codeMirrorAddContentHandler} memoId={memoId}/>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </>}</>
    );

}

export default MemoEditPage;