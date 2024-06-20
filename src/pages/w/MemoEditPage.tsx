import MonacoEditor, {MonacoEditorHandle} from "@/components/ui/MonacoEditor.tsx";
import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import InternalError from "@/components/ui/InternalError.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {MemoContext} from "@/context/MemoContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import MemoEditPage__MemoPreviewModal
    from "@/page_components/memo_edit_page/memo_edit_page__modals/MemoEditPage__MemoPreviewModal.tsx";
import MemoEditPage__MemoToolbar from "@/page_components/memo_edit_page/MemoEditPage__MemoToolbar.tsx";
import {useForm} from "react-hook-form";
import {UpdateMemoForm} from "@/openapi/model";
import {useCreateMemoImage, useUpdateMemo} from "@/openapi/api/memos/memos.ts";
import {Bounce, toast} from "react-toastify";
import axios from "axios";
import {importData} from "@/axios/import-data.ts";
import DragPage from "@/pages/drag/DragPage.tsx";

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
    const editorRef = useRef<MonacoEditorHandle>(null);
    const [isDragging, setIsDragging] = useState(false);

    const updateMemoForm = useForm<UpdateMemoForm>({
        defaultValues: {},
    });

    /* 이미지 업로드 */
    const {mutateAsync: createMemoImage} = useCreateMemoImage();

    const {mutate: updateMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모가 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
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

    const onUpdateMemoSubmit = () => {
        updateMemo({
            memoId: memoId,
            data: updateMemoForm.getValues()
        });
    }

    // 드래그앤드롭으로 썸네일 등록
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);

        handleUploadFile(event);
    };

    const handleUploadFile = async (event: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
        let file;
        if (event.type === 'change') {
            const changeEvent = event as ChangeEvent<HTMLInputElement>;
            file = changeEvent.target.files ? changeEvent.target.files[0] : null;
            changeEvent.target.value = '';
        }

        if (event.type === 'drop') {
            const dragEvent = event as React.DragEvent<HTMLDivElement>;
            file = dragEvent.dataTransfer.files[0];
        }

        if (file) {
            const data = await createMemoImage({
                memoId: memoId!,
                data: {
                    mimeType: file.type,
                },
            })

            try {
                const response = await axios.put(data.uploadURL!, file, {
                    headers: {
                        'Content-Type': file.type,
                    },
                });

                if (response.status === 200) {
                    const requestURL = `${importData.VITE_MEMOCODE_SERVER_URL}/memos/${memoId}/images/${data.memoImageId}.${data.extension}`;
                    const markdownImageUrl = `![Image](${requestURL})\n\n`;
                    handleMonacoEditorInsertTextAtCursor(markdownImageUrl);

                    toast.success("성공적으로 이미지가 업로드 되었습니다.", {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                    });
                    await findMyMemo.refetch();
                } else {
                    console.error('업로드 실패', response.data);
                    toast.error("업로드 실패 관리자에게 문의하세요", {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                    });
                }
            } catch (error) {
                console.error('에러', error);
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
            }

        } else {
            toast.error("jpeg 이미지만 업로드 가능합니다.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
            });
        }
    }

    const handleMonacoEditorInsertTextAtCursor = (imageUrl: string) => {
        if (editorRef.current) {
            editorRef.current.insertTextAtCursor(imageUrl);
        }
    };


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

    if (findMyMemo.isError) {
        console.log(findMyMemo.error);
        return <InternalError onClick={() => findMyMemo.refetch()}/>
    }

    return (
        <>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true); // 이미지 드래그 하는 동안 배경
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={handleDrop}
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

                {isDragging && (
                    <DragPage/>
                )}

                <div className="flex-1 flex bg-transparent">
                    <div className="flex-1 flex flex-col relative items-center mt-12">

                        <MemoEditPage__MemoToolbar onUpdateMemoSubmit={onUpdateMemoSubmit}
                                                   onChangeImageIconInput={handleUploadFile}
                        />

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
                                ref={editorRef}
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