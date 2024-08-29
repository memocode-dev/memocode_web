'use client'

import {Bounce, toast} from "react-toastify";
import {Badge} from "@/components/ui/badge";
import {IoMdCloseCircle} from "react-icons/io";
import React, {ChangeEvent, useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {useTheme} from "@/context/ThemeContext";
import {Button} from "@/components/ui/button";
import {TbCloudUpload, TbDragDrop} from "react-icons/tb";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface MemoDetailFormProps {
    form: UseFormReturn<any, unknown, any>;
    handleUploadFile: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MyMemoUpdateDetailInfoForm = ({
                                        form,
                                        handleUploadFile,
                                    }: MemoDetailFormProps) => {

    const {theme} = useTheme()
    const [inputValue, setInputValue] = useState("")
    const [isComposing, setIsComposing] = useState(false); // 태그 한글 입력 중인지 여부
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isHover, setIsHover] = useState<boolean>(false);

    // 버튼으로 썸네일 등록
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // 썸네일 제거
    const handleDeleteThumbnail = () => {
        form.setValue("thumbnailUrl", "")
    }

    return (
        <>
            <>
                <div className="flex flex-col space-x-0 sm:flex-row sm:space-y-0 sm:space-x-6">
                    {/* 썸네일 */}
                    <div className={`flex flex-col space-y-2 bg-transparent py-1 h-[300px]`}>

                        {form.watch("thumbnailUrl") ?
                            <img src={form.getValues("thumbnailUrl")} alt="Thumbnail_preview"
                                 className="w-full h-full sm:w-[300px] xl:w-[350px] border border-gray-200 dark:border-neutral-600"/>
                            :
                            <div
                                className="flex border border-gray-200 dark:border-neutral-600 bg-gray-100 dark:bg-neutral-800 w-full h-full sm:w-[300px] xl:w-[350px] justify-center items-center cursor-default">
                                    <span
                                        className="text-sm tracking-tight text-gray-500 dark:text-gray-400">선택된 파일 없음</span>
                            </div>
                        }

                        <div className="flex flex-1 space-x-2">

                            {form.getValues("thumbnailUrl") &&
                                <TooltipProvider>
                                    <Tooltip delayDuration={100} open={isHover}>
                                        <TooltipTrigger asChild
                                                        onClick={handleDeleteThumbnail}
                                                        onMouseOver={() => setIsHover(true)}
                                                        onMouseLeave={() => setIsHover(false)}>
                                            <Button
                                                variant="default"
                                                className="flex-1">제거</Button>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            sideOffset={10}
                                            side="bottom"
                                            className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-sm tracking-wide">
                                            <p>썸네일 제거 후 저장 버튼을 눌러주세요!</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            }

                            <>
                                <Button
                                    onClick={triggerFileInput}
                                    className="flex-1 sm:hidden space-x-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-500">
                                    <TbCloudUpload className="w-6 h-6"/>
                                    <span>버튼으로 변경</span>
                                </Button>
                                <input
                                    id="fileInput"
                                    accept=".jpeg,.jpg,.gif,.png"
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleUploadFile}
                                />
                            </>
                        </div>
                    </div>

                    {/* 썸네일 버튼 */}
                    <div className="hidden sm:flex flex-1 flex-col">
                        <div className="flex flex-1 bg-transparent justify-center items-center">
                            <Button
                                onClick={triggerFileInput}
                                className="space-x-2 font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-500 focus-visible:ring-0">
                                <TbCloudUpload className="w-6 h-6"/>
                                <span>버튼으로 변경</span>
                            </Button>
                            <input
                                id="fileInput"
                                accept=".jpeg,.jpg,.gif,.png"
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleUploadFile}
                            />
                        </div>

                        <div className="flex">
                            <div className="flex flex-1 h-0 mt-3 border border-gray-200 dark:border-neutral-600"></div>
                            <div className="mx-5">또는</div>
                            <div className="flex flex-1 h-0 mt-3 border border-gray-200 dark:border-neutral-600"></div>
                        </div>

                        <div
                            className={`flex flex-1 bg-transparent justify-center items-center space-x-2 font-semibold text-sm cursor-default`}>
                            <TbDragDrop className="w-6 h-6"/><span>드래그로 변경</span>
                        </div>
                    </div>
                </div>
            </>

            {/* 제목 */}
            <div className="flex bg-transparent mt-10">
                <textarea
                    {...form.register("title")}
                    placeholder="제목"
                    className="flex w-full h-14 text-3xl py-2 bg-transparent placeholder-gray-300 focus:outline-none resize-none"
                />
            </div>

            {/*  소개글 */}
            <div className="flex bg-transparent">
                <textarea
                    {...form.register("summary")}
                    placeholder="짧은 소개글"
                    className="flex w-full text-2xl py-2 bg-transparent placeholder-gray-300 focus:outline-none resize-none"
                />
            </div>

            {/* 태그 */}
            <div className="flex-1 space-y-3 py-5">
                <input
                    className="bg-transparent w-full h-10 text-lg sm:text-2xl placeholder-gray-300 focus:outline-none"
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

                            const beforeTags = form.getValues("tags");
                            if (beforeTags.includes(trimmedValue)) {
                                toast.error("태그가 이미 존재합니다.", {
                                    position: "bottom-right",
                                    theme: theme,
                                    transition: Bounce,
                                });
                                return;
                            }

                            if (beforeTags.length >= 10) {
                                toast.error("태그는 최대 10개까지 가능합니다.", {
                                    position: "bottom-right",
                                    theme: theme,
                                    transition: Bounce,
                                });
                                return;
                            }

                            form.setValue("tags", [...beforeTags, trimmedValue]);
                            setInputValue("");
                        }
                    }}
                />
                <div className="flex flex-wrap">
                    {form.watch("tags")?.map((tag: string, index: number) => (
                        tag !== "" &&
                        <Badge key={index}
                               className="flex pl-3 pr-2 space-x-2 text-sm mr-1 mb-1 cursor-default">
                            <span>{tag}</span>
                            <IoMdCloseCircle
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => {
                                    form.setValue("tags", form.watch("tags").filter((t: string) => t !== tag));
                                }}/>
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    )
}

export default MyMemoUpdateDetailInfoForm;