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
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        if (findMemo.data) {
            memoForm.reset({
                title: findMemo.data.title,
                content: findMemo.data.content,
            });
        }
    }, [findMemo.data]);

    useEffect(() => {
        const div = divRef.current;
        if (div) {
            // ResizeObserver 인스턴스 생성
            const resizeObserver = new ResizeObserver(entries => {
                const { width, height } = entries[0].contentRect;
                setWidth(width - 5);
                setHeight(height - 100);
            });

            // 관찰 시작
            resizeObserver.observe(div);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => resizeObserver.unobserve(div);
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
                        <div className="flex-1 flex flex-col relative items-center mt-12">

                            {/* toolbar */}
                            <MemoToolbar width={width}/>


                            {/* title */}
                            <div className="flex w-full my-1 bg-transparent">
                                <input
                                    placeholder="제목없음"
                                    {...memoForm.register("title")}
                                    className="text-2xl px-6 bg-transparent placeholder-gray-300 focus:outline-none"
                                    style={{
                                        width: `${width}px`,
                                        overflow: 'hidden',
                                        resize: 'none',
                                    }}
                                />
                            </div>

                            {/* content */}
                            <div className="flex flex-1 w-full">
                                <MonacoEditor
                                    width={`${width}px`}
                                    height={`${height}px`}
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