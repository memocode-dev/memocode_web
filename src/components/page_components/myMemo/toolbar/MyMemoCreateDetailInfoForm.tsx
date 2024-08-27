'use client'

import {Bounce, toast} from "react-toastify";
import {Badge} from "@/components/ui/badge";
import {IoMdCloseCircle} from "react-icons/io";
import React, {useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {useTheme} from "@/context/ThemeContext";

interface MemoDetailFormProps {
    form: UseFormReturn<any, unknown, any>;
}

const MyMemoCreateDetailInfoForm = ({form}: MemoDetailFormProps) => {

    const {theme} = useTheme()
    const [inputValue, setInputValue] = useState("")
    const [isComposing, setIsComposing] = useState(false); // 태그 한글 입력 중인지 여부

    return (
        <>
            {/* 제목 */}
            <div className="flex bg-transparent">
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

export default MyMemoCreateDetailInfoForm;