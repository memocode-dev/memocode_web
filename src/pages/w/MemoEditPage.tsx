import MonacoEditor from "@/components/ui/MonacoEditor.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import InternalError from "@/components/ui/InternalError.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {MemoContext} from "@/context/MemoContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import MemoEditPage__MemoPreviewModal
    from "@/page_components/memo_edit_page/memo_edit_page__modals/MemoEditPage__MemoPreviewModal.tsx";
import MemoEditPage__MemoToolbar from "@/page_components/memo_edit_page/MemoEditPage__MemoToolbar.tsx";
import {useForm} from "react-hook-form";
import {UpdateMemoForm} from "@/openapi/model";
import {useUpdateMemo} from "@/openapi/api/memos/memos.ts";
import {toast} from "react-toastify";

const MemoEditPage = () => {

    const {theme} = useContext(ThemeContext);

    const {
        findMyMemo,
        findAllMyMemo,
    } = useContext(MemoContext);

    const {openModal, modalState, closeModal} = useContext(ModalContext);

    const [memoId, setMemoId] = useState("");

    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const updateMemoForm = useForm<UpdateMemoForm>({
        defaultValues: {},
    });

    const {mutate: updateMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 대표 글이 설정되었습니다.")
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
                closeModal({name: ModalTypes.MEMO_DETAIL_INFO})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            },
        }
    })


    useEffect(() => {
        if (findMyMemo.data) {
            setMemoId(findMyMemo.data.id!);
            updateMemoForm.reset({
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
                const {width, height} = entries[0].contentRect;
                setWidth(width - 5);
                setHeight(height - 100);
            });

            // 관찰 시작
            resizeObserver.observe(div);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => resizeObserver.unobserve(div);
        }
    }, []);

    const onUpdateMemoSubmit = () => {
        updateMemo({
            memoId: memoId,
            data: updateMemoForm.getValues()
        });
    }

    if (findMyMemo.isError) {
        console.log(findMyMemo.error);
        return <InternalError onClick={() => findMyMemo.refetch()}/>
    }

    return (
        <>
            <div
                onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.code === "KeyS") {
                        e.preventDefault();
                        onUpdateMemoSubmit();
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
                className="flex-1 flex flex-col bg-background">

                <div className="flex-1 flex bg-transparent">
                    <div className="flex-1 flex flex-col relative items-center mt-12">

                        {/* 메모 툴바 */}
                        <MemoEditPage__MemoToolbar onUpdateMemoSubmit={onUpdateMemoSubmit}/>

                        {/* 메모 제목 */}
                        <div className="flex w-full my-1 bg-transparent">
                            <input
                                placeholder="제목없음"
                                {...updateMemoForm.register("title")}
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
                                onChange={(value) => updateMemoForm.setValue("content", value)}
                                value={updateMemoForm.watch("content")}
                            />
                        </div>


                        <MemoEditPage__MemoPreviewModal content={updateMemoForm.watch("content")!}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MemoEditPage;