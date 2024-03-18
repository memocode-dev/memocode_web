import MonacoEditor from "@/components/common/MonacoEditor.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import InternalError from "@/components/common/InternalError.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import MemoPreview from "@/components/memos/toolbar/menu/MemoPreview.tsx";
import MemoToolbar from "@/components/memos/toolbar/MemoToolbar.tsx";
import {MemoContext} from "@/context/MemoContext.tsx";

const MemoEdit = () => {
    const {theme} = useContext(ThemeContext);

    const {
        findMemo,
        memoForm,
        onMemoUpdateSubmit
    } = useContext(MemoContext);

    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if (findMemo.data) {
            memoForm.reset({
                title: findMemo.data.title,
                content: findMemo.data.content,
            });
        }
    }, [findMemo.data]);

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


    if (findMemo.isError) {
        console.log(findMemo.error);
        return <InternalError onClick={() => findMemo.refetch()}/>
    }

    return (
        <>
            <div ref={divRef} className="flex-1 flex flex-col bg-white dark:bg-[#1E1E1E] relative">
                <MemoPreview content={memoForm.watch("content")}/>

                <div className="flex-1 flex bg-transparent">
                    {!findMemo.isLoading &&
                        <div className="flex-1 flex flex-col relative items-center mt-20">

                            {/* toolbar */}
                            <MemoToolbar/>


                            {/* title */}
                            <div className="flex w-full max-w-[900px] my-2 bg-transparent">
                                <textarea
                                    placeholder="제목없음"
                                    {...memoForm.register("title")}
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
                                    onChange={(value) => memoForm.setValue("content", value)}
                                    value={memoForm.watch("content")}
                                    onKeyDown={(e) => {
                                        if (e.ctrlKey && e.code === "KeyS") {
                                            onMemoUpdateSubmit();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default MemoEdit;