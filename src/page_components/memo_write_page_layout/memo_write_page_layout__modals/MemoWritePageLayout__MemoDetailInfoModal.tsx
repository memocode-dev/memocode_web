import React, {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TbCloudUpload, TbDragDrop} from "react-icons/tb";
import {MemoContext} from "@/context/MemoContext.tsx";
import {toast} from "react-toastify";
import {useUpdateMemo} from "@/openapi/api/memos/memos.ts";
import {Badge} from "@/components/ui/badge.tsx";
import {IoMdCloseCircle} from "react-icons/io";

const MemoWritePageLayout__MemoDetailInfoModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const [inputValue, setInputValue] = useState("")
    const [isComposing, setIsComposing] = useState(false); // 한글 입력 중인지 여부
    const [tags, setTags] = useState([""])

    const {
        memoId,
        findMyMemo,
        findAllMyMemo,
        onMemoCreateSubmit,
        writeMemoForm
    } = useContext(MemoContext);

    const [dragOver, setDragOver] = useState(false);
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    /* 메모 상세정보 수정 */
    const {mutate: UpdateRepresentativeMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 대표 글이 설정되었습니다.")
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            },
        }
    })

    const handleRepresentativeMemo = () => {
        if (!modalState[ModalTypes.MEMO_DETAIL_INFO].data.createNewMemo) {
            UpdateRepresentativeMemo({
                memoId: memoId!,
                data: {
                    title: writeMemoForm.watch("title"),
                    summary: writeMemoForm.watch("summary"),
                },
            })
        }

        if (modalState[ModalTypes.MEMO_DETAIL_INFO].data.createNewMemo) {
            onMemoCreateSubmit()
        }

        closeModal({name: ModalTypes.MEMO_DETAIL_INFO})
    }

    const handleCloseRepresentativeMemo = () => {
        setThumbnail(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        writeMemoForm.reset({
            title: "",
            summary: "",
        });

        closeModal({name: ModalTypes.MEMO_DETAIL_INFO})
    }

    // 드래그앤드롭으로 썸네일 등록
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);

        const files = e.dataTransfer.files;

        if (files.length) {
            handleUploadFiles(files);
        }
    };

    // 버튼으로 썸네일 등록
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            handleUploadFiles(files);
        }
    };

    const handleUploadFiles = (files: FileList) => {
        const file = files[0];
        console.log("thumbnail", file)
        if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
            setThumbnail(file);
        }
    };

    useEffect(() => {

        if (!modalState[ModalTypes.MEMO_DETAIL_INFO].data.createNewMemo && findMyMemo.data) {
            writeMemoForm.reset({
                title: findMyMemo.data.title,
                summary: findMyMemo.data.summary,
                content: "",
                security: false,
            });
        }

    }, [modalState[ModalTypes.MEMO_DETAIL_INFO].data.createNewMemo, findMyMemo.data]);

    return (
        <Dialog open={modalState[ModalTypes.MEMO_DETAIL_INFO].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 dark:bg-neutral-700 h-[90vh] overflow-y-auto outline-0">
                <DialogHeader>
                    <DialogTitle>메모 상세정보 작성하기</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-300">
                        메모의 상세정보를 작성해보세요! 블로그에 게시되면 다른 사람들도 볼 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row sm:space-x-6">
                    {/* 썸네일 */}
                    <div
                        className={`file-upload ${dragOver ? 'drag-over' : ''} flex flex-col sm:flex-row bg-transparent py-1 h-[250px]`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setDragOver(false);
                        }}
                        onDrop={handleDrop}
                    >
                        {thumbnail ? (
                            <img src={URL.createObjectURL(thumbnail)} alt="Thumbnail preview"
                                 className="w-full h-full sm:w-[250px] lg:w-[300px] object-cover"/>
                        ) : (
                            <div
                                className="flex bg-gray-100 dark:bg-neutral-800 flex-1 sm:w-[250px] lg:w-[300px] justify-center items-center cursor-default">
                                <span
                                    className="text-sm tracking-tight text-gray-500 dark:text-gray-400">선택된 파일 없음</span>
                            </div>
                        )}
                    </div>

                    {/* 썸네일 버튼 */}
                    <div className="flex flex-1 flex-col mt-5 sm:mt-0 space-y-5 sm:space-y-0">
                        <div className="flex flex-1 bg-transparent justify-center items-center">
                            <Button onClick={triggerFileInput}
                                    className="space-x-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-500 focus-visible:ring-0">
                                <TbCloudUpload className="w-6 h-6"/>
                                <span>버튼으로 등록</span>
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileInputChange}
                            />
                        </div>

                        <div className="flex">
                            <div className="flex flex-1 h-0 mt-3 border border-gray-200"></div>
                            <div className="mx-5">또는</div>
                            <div className="flex flex-1 h-0 mt-3 border border-gray-200"></div>
                        </div>

                        <div
                            className="flex flex-1 bg-transparent justify-center items-center space-x-2 font-semibold text-sm cursor-default">
                            <TbDragDrop className="w-6 h-6"/><span>드래그로 등록</span>
                        </div>
                    </div>
                </div>

                {/* 제목 */}
                <div className="flex bg-transparent">
                    <textarea
                        {...writeMemoForm.register("title")}
                        placeholder="제목"
                        className="flex w-full h-14 text-3xl sm:px-6 py-2 bg-transparent placeholder-gray-300 focus:outline-none resize-none"
                    />
                </div>

                {/*  소개글 */}
                <div className="flex bg-transparent">
                    <textarea
                        {...writeMemoForm.register("summary")}
                        placeholder="짧은 소개글"
                        className="flex w-full text-2xl sm:px-6 py-2 bg-transparent placeholder-gray-300 focus:outline-none resize-none"
                    />
                </div>

                {/* 태그 */}
                <div className="flex-1 space-y-3 py-5">
                    <input
                        className="bg-transparent w-full h-10 text-lg sm:text-2xl sm:px-3 placeholder-gray-300 focus:outline-none"
                        type="text"
                        placeholder="태그를 입력해주세요 (10개까지 입력 가능)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onCompositionStart={() => setIsComposing(true)} // 한글 입력 시작
                        onCompositionEnd={() => setIsComposing(false)} // 한글 입력 완료
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !isComposing) {
                                event.preventDefault();
                                const trimmedValue = inputValue.trim().toLowerCase();

                                if (!trimmedValue) return; // 빈 값은 추가하지 않음

                                if (tags.includes(trimmedValue)) {
                                    toast.error("태그가 이미 존재합니다.");
                                    return;
                                }

                                if (tags.length >= 10) {
                                    toast.error("태그는 최대 10개까지 가능합니다.");
                                    return;
                                }

                                setTags([...tags, trimmedValue]);
                                setInputValue("");
                            }
                        }}
                    />
                    <div className="flex flex-wrap sm:px-3">
                        {tags?.map((tag, index) => (
                            tag !== "" &&
                            <Badge key={index}
                                   className="flex pl-3 pr-2 space-x-2 text-sm text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1 mb-1 cursor-default">
                                <span>{tag}</span>
                                <IoMdCloseCircle
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={() => {
                                        setTags(tags.filter((t) => t !== tag));
                                    }}/>
                            </Badge>
                        ))}
                    </div>
                </div>

                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <DialogClose asChild>
                        <Button
                            className="w-auto bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
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
    )
}

export default MemoWritePageLayout__MemoDetailInfoModal