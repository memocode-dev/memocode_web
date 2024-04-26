import MonacoEditor from "@/components/ui/MonacoEditor.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import InternalError from "@/components/ui/InternalError.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {MemoContext} from "@/context/MemoContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import MemoEditPage__MemoPreviewModal from "@/page_components/memo_edit_page/memo_edit_page__modals/MemoEditPage__MemoPreviewModal.tsx";
import MemoEditPage__MemoToolbar from "@/page_components/memo_edit_page/MemoEditPage__MemoToolbar.tsx";

const MemoEditPage = () => {

    const {theme} = useContext(ThemeContext);

    const {
        findMyMemo,
        memoForm,
        onMemoUpdateSubmit,
        memoId,
    } = useContext(MemoContext);

    const {openModal, modalState, closeModal} = useContext(ModalContext);

    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        if (findMyMemo.data) {
            memoForm.reset({
                title: findMyMemo.data.title,
                content: findMyMemo.data.content,
            });
        }
    }, [findMyMemo.data]);

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

    if (findMyMemo.isError) {
        console.log(findMyMemo.error);
        return <InternalError onClick={() => findMyMemo.refetch()}/>
    }

    return (
        <div
            onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
                    e.preventDefault();
                    onMemoUpdateSubmit();
                }

                if ((e.metaKey || e.ctrlKey) && e.code === "KeyP") {
                    e.preventDefault();

                    if (modalState[ModalTypes.MEMO_PREVIEW].isVisible) {
                        closeModal({
                            name: ModalTypes.MEMO_PREVIEW
                        });
                    } else {
                        openModal({
                            name: ModalTypes.MEMO_PREVIEW
                        });
                    }
                }
            }}
            ref={divRef}
            className="flex-1 flex flex-col bg-background relative">

            <MemoEditPage__MemoPreviewModal content={memoForm.watch("content")}/>

            <div className="flex-1 flex bg-transparent">
                {!findMyMemo.isLoading &&
                    <div className="flex-1 flex flex-col relative items-center mt-12">

                        {/* 메모 툴바 */}
                        <MemoEditPage__MemoToolbar />

                        {/* 메모 제목 */}
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

                        {/* 메모 내용 */}
                        <div className="flex flex-1 w-full">
                            <MonacoEditor
                                key={memoId}
                                width={`${width}px`}
                                height={`${height}px`}
                                language="markdown"
                                theme={theme === "light" ? "vs" : "vs-dark"}
                                onChange={(value) => memoForm.setValue("content", value)}
                                value={memoForm.watch("content")}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default MemoEditPage;