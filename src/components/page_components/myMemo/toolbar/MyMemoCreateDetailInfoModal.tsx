'use client'

import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
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
import {useCreateMemo, useCreateMemoImage, useUpdateMemo} from "@/openapi/api/memos/memos";
import {useForm} from "react-hook-form";
import {CreateMemoForm, UpdateMemoForm} from "@/openapi/model";
import {useRouter} from "next/navigation";
import {useTheme} from "@/context/ThemeContext";
import MyMemoCreateDetailInfoForm from "@/components/page_components/myMemo/toolbar/MyMemoCreateDetailInfoForm";
import Loading from "@/app/loading";
import DragPage from "@/components/pages/drag/DragPage";
import axios from "axios";
import {importData} from "@/axios/import-data";

const MyMemoCreateDetailInfoModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const router = useRouter()
    const {theme} = useTheme()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDraggingInModal, setIsDraggingInModal] = useState(false); // 드래그 페이지 표시
    const [isLoadingInModal, setIsLoadingInModal] = useState(false); // 이미지 업로드 중 로딩 페이지 표시
    const divRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const {
        findMyMemo,
        findAllMyMemo,
    } = useContext(MemoContext);

    // 메모 생성
    const {mutateAsync: createMemo} = useCreateMemo();

    /* 이미지 업로드 */
    const {mutateAsync: createMemoImage} = useCreateMemoImage();

    // 메모 수정
    const {mutate: updateMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async (memoId, data) => {
                toast.success("성공적으로 메모가 생성되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
                typeof window !== 'undefined' && router.push(`/w/${data.memoId}`);
                setSelectedFile(null);
                closeModal({name: ModalTypes.MY_MEMO_CREATE_DETAIL_INFO})
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

    const createMemoForm = useForm<CreateMemoForm>({
        defaultValues: {
            title: "",
            content: "",
            summary: "",
            tags: [],
            security: false,
        },
    });

    const updateMemoForm = useForm<UpdateMemoForm>({
        defaultValues: {},
    });

    const handleSave = async () => {

        const memoId = await createMemo({
            data: createMemoForm.getValues(),
        })

        if (selectedFile) {

            setIsLoadingInModal(true); // 로딩 화면 시작

            try {
                const data = await createMemoImage({
                    memoId: memoId!,
                    data: {
                        mimeType: selectedFile ? selectedFile.type : undefined,
                    },
                })

                if (data) {
                    const response = await axios.put(data.uploadURL!, selectedFile, {
                        headers: {
                            'Content-Type': selectedFile ? selectedFile.type : undefined,
                        },
                    });

                    if (response.status === 200) {
                        const requestURL = `${importData.NEXT_PUBLIC_MEMOCODE_SERVER_URL}/memos/${memoId}/images/${data.memoImageId}.${data.extension}`;

                        updateMemoForm.reset({
                            title: createMemoForm.getValues("title"),
                            summary: createMemoForm.getValues("summary"),
                            tags: createMemoForm.getValues("tags"),
                            thumbnailUrl: requestURL
                        });

                        updateMemo({
                            memoId: memoId!,
                            data: updateMemoForm.getValues(),
                        });

                    } else {
                        console.error('메모 수정 단계에서 실패', response.data);
                        toast.error("관리자에게 문의하세요", {
                            position: "bottom-right",
                            theme: theme,
                            transition: Bounce,
                            className: "text-sm",
                        });
                    }
                }
            } catch (error) {
                console.error('에러', error);
                toast.error("jpeg 이미지만 업로드 가능합니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            } finally {
                setIsLoadingInModal(false); // 로딩 화면 종료
            }

        } else {
            toast.success("성공적으로 메모가 생성되었습니다.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
                className: "text-sm",
            });
            await findAllMyMemo.refetch();
            typeof window !== 'undefined' && router.push(`/w/${memoId}`);
            setSelectedFile(null);
            closeModal({name: ModalTypes.MY_MEMO_CREATE_DETAIL_INFO})
        }
    }

    // 드래그앤드롭으로 썸네일 등록
    const handleDropInModal = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // 기본 동작을 막습니다.
        event.stopPropagation(); // 이벤트 전파를 막습니다.
        setIsDraggingInModal(false);

        handleUploadFileInModal(event);
    };

    // 썸네일 이미지 선택
    const handleUploadFileInModal = async (event: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
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
            setSelectedFile(file)
        }
    }

    // 메모 생성 안하고 모달 달기
    const handleClose = () => {
        setSelectedFile(null)
        closeModal({name: ModalTypes.MY_MEMO_CREATE_DETAIL_INFO})
    }

    useEffect(() => {
        if (!modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO].isVisible) {
            createMemoForm.reset();
        }
    }, [modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO]]);

    useEffect(() => {
        if (!divRef.current) return;

        if (modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO]?.isVisible === true) {
            // ResizeObserver 인스턴스 생성
            const resizeObserver = new ResizeObserver(entries => {
                const {width, height} = entries[0].contentRect;
                setWidth(width);
                setHeight(height - 110);
            });

            // 관찰 시작
            resizeObserver.observe(divRef.current);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => {
                if (divRef.current) {
                    resizeObserver.unobserve(divRef.current);
                }
            };
        }
    }, [divRef.current, modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO]]);

    return (
        <>
            {/* 로딩 표시 */}
            {isLoadingInModal && <Loading/>}

            <Dialog open={modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO].isVisible}>
                <DialogContent
                    ref={divRef}
                    onDragOver={(e) => {
                        e.preventDefault(); // 기본 동작을 막습니다.
                        e.stopPropagation(); // 이벤트 전파를 막습니다.
                        setIsDraggingInModal(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault(); // 기본 동작을 막습니다.
                        e.stopPropagation(); // 이벤트 전파를 막습니다.
                        setIsDraggingInModal(false);
                    }}
                    onDrop={handleDropInModal}
                    className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 h-[90vh] overflow-y-auto outline-0">

                    {/* 드래그 표시 */}
                    {isDraggingInModal && <DragPage className="top-20 left-6" width={width} height={height}/>}

                    <DialogHeader>
                        <DialogTitle>메모 등록하기</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-300">
                            메모의 상세정보를 작성해보세요! 블로그에 게시되면 다른 사람들도 볼 수 있습니다.
                        </DialogDescription>
                    </DialogHeader>

                    <MyMemoCreateDetailInfoForm
                        form={createMemoForm}
                        selectedFile={selectedFile!}
                        setSelectedFile={setSelectedFile}
                    />

                    <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                        <DialogClose asChild>
                            <Button
                                className="w-auto"
                                type="submit"
                                onClick={handleSave}
                            >
                                저장
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button
                                onClick={handleClose}
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

export default MyMemoCreateDetailInfoModal;