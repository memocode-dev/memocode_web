'use client'

import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {MemoContext} from "@/context/MemoContext";
import {Bounce, toast} from "react-toastify";
import {useCreateMemoImage, useUpdateMemo} from "@/openapi/api/memos/memos";
import {useForm} from "react-hook-form";
import {UpdateMemoForm} from "@/openapi/model";
import {useTheme} from "@/context/ThemeContext";
import MyMemoUpdateDetailInfoForm from "@/components/page_components/myMemo/toolbar/MyMemoUpdateDetailInfoForm";
import Loading from "@/app/loading";
import DragPage from "@/components/pages/drag/DragPage";
import axios from "axios";
import {importData} from "@/axios/import-data";

const MyMemoUpdateDetailInfoModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const [memoId, setMemoId] = useState("");
    const {theme} = useTheme()
    const [isDragging, setIsDragging] = useState(false); // 드래그 페이지 표시
    const [isLoading, setIsLoading] = useState(false); // 이미지 업로드 중 로딩 페이지 표시

    /* 이미지 업로드 */
    const {mutateAsync: createMemoImage} = useCreateMemoImage();

    const {
        findMyMemo,
        findAllMyMemo,
    } = useContext(MemoContext);

    const updateMemoForm = useForm<UpdateMemoForm>({
        defaultValues: {},
    });

    const {mutate: UpdateRepresentativeMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모가 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
                closeModal({name: ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            },
        }
    })

    const handleRepresentativeMemo = () => {
        UpdateRepresentativeMemo({
            memoId: memoId!,
            data: updateMemoForm.getValues(),
        });
    }

    const handleCloseRepresentativeMemo = () => {
        updateMemoForm.reset();
        closeModal({name: ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO})
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
            setIsLoading(true); // 로딩 화면 시작

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
                    event.stopPropagation();
                    const requestURL = `${importData.NEXT_PUBLIC_MEMOCODE_SERVER_URL}/memos/${memoId}/images/${data.memoImageId}.${data.extension}`;

                    updateMemoForm.setValue("thumbnailUrl", requestURL)

                } else {
                    console.error('썸네일 업로드 실패', response.data);
                    toast.error("썸네일 업로드 실패 : 관리자에게 문의하세요", {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                        className: "text-sm",
                    });
                }
            } catch (error) {
                console.error('에러', error);
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            } finally {
                setIsLoading(false); // 로딩 화면 종료
            }

        } else {
            toast.error("jpeg 이미지만 업로드 가능합니다.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
                className: "text-sm",
            });
        }
    }

    useEffect(() => {
        if (findMyMemo.data) {
            setMemoId(findMyMemo.data.id!);
            updateMemoForm.reset({
                title: findMyMemo.data.title,
                summary: findMyMemo.data.summary,
                tags: findMyMemo.data.tags,
                thumbnailUrl: findMyMemo.data.thumbnailUrl
            });
        }
    }, [findMyMemo.data]);

    if (!memoId) {
        return <Loading/>;
    }

    return (
        <>
            {/* 로딩 표시 */}
            {isLoading && <Loading/>}

            {/*드래그 표시*/}
            {isDragging && <DragPage/>}

            <Dialog open={modalState[ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO].isVisible}>
                <DialogContent
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                    className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 h-[90vh] overflow-y-auto outline-0">
                    <DialogHeader>
                        <DialogTitle>메모 상세정보 수정하기</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-300">
                            메모의 상세정보를 수정해보세요! 블로그에 게시되면 다른 사람들도 볼 수 있습니다.
                        </DialogDescription>
                    </DialogHeader>

                    <MyMemoUpdateDetailInfoForm form={updateMemoForm} handleUploadFile={handleUploadFile}/>

                    <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                        <DialogClose asChild>
                            <Button
                                className="w-auto"
                                type="submit"
                                onClick={handleRepresentativeMemo}
                            >
                                저장
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button
                                onClick={handleCloseRepresentativeMemo}
                                type="button"
                                variant="secondary"
                                className="hover:bg-secondary-hover"
                            >
                                닫기
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MyMemoUpdateDetailInfoModal;