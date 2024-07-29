'use client'

import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {useTheme} from "@/context/ThemeContext";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {Textarea} from "@/components/ui/textarea";
import {RiAddLine} from "react-icons/ri";
import {IItem} from "@/components/page_components/myBlog/MyBlogUpdateProfileAddFiledModal";

const MyBlogUpdateProfileModal = () => {

    const {modalState, closeModal, openModal} = useContext(ModalContext)
    const profile = modalState[ModalTypes.MY_BLOG_UPDATE_PROFILE].data
    const {theme} = useTheme()
    const [addedFiled, setAddedFiled] = useState<IItem[]>([]);

    const {
        watch,
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();


    useEffect(() => {
        if (profile) {
            reset({
                introduce: profile?.introduce,
                email: profile.email,
            })
        }
    }, [profile]);

    useEffect(() => {
        console.log("addedFiled", addedFiled)
    }, [addedFiled]);

    return (
        <div
            className={`
            ${modalState[ModalTypes.MY_BLOG_UPDATE_PROFILE]?.isVisible ? "fixed z-[100] top-0 bottom-0 left-0 right-0 bg-black/70 flex w-full h-full justify-center items-center" : "hidden"}
        `}
        >
            <div
                className="flex flex-col bg-background dark:bg-neutral-700 min-h-[90vh] h-[90%] w-[90%] lg:w-[50%] rounded-lg p-6 space-y-5">
                <div className="flex justify-center items-center">
                    <div>프로필 변경</div>
                </div>

                <div className="flex flex-col py-5">
                    <div className="h-fit space-y-7">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="introduce">한 줄 소개</Label>
                            <Textarea
                                placeholder="50자 이하로 작성해주세요."
                                className="h-32 resize-none rounded"
                                maxLength={50}
                                id="introduce"
                                {...register("introduce")}
                                value={watch("introduce")}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                className="rounded"
                                id="email"
                                {...register("email")}
                                value={watch("email")}
                            />
                        </div>

                        {addedFiled.length !== 0 && addedFiled.map((filed, index) => {
                            return (
                                <div key={index} className="flex flex-col space-y-1.5">
                                    <Label htmlFor={filed.id}>{filed.label}</Label>
                                    <Input
                                        className="rounded"
                                        id={filed.id}

                                        // {...register("email")}
                                        // value={watch("email")}
                                    />
                                </div>
                            )
                        })}

                        <Button
                            onClick={() => {
                                openModal({
                                    name: ModalTypes.MY_BLOG_UPDATE_PROFILE_ADD_FILED,
                                    data: {setAddedFiled}
                                })
                            }}
                            className="w-full h-fit bg-transparent hover:bg-secondary p-1 rounded
                                    text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                            <RiAddLine className="w-6 h-6"/>
                            <span className="p-1 font-semibold">정보 추가</span>
                        </Button>

                    </div>
                </div>

                <div className="flex flex-row justify-center sm:justify-center space-x-1">
                    <Button
                        onClick={() => {
                            // onCreateQuestionChildCommentSubmit()
                        }}
                        type="button"
                        className="rounded"
                    >
                        저장
                    </Button>

                    <Button
                        onClick={() => {
                            reset();
                            closeModal({
                                name: ModalTypes.MY_BLOG_UPDATE_PROFILE
                            });
                        }}
                        className="rounded hover:bg-secondary-hover"
                        type="button"
                        variant="secondary"
                    >
                        닫기
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MyBlogUpdateProfileModal;