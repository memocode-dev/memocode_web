'use client'

import React, {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {useTheme} from "@/context/ThemeContext";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useForm} from "react-hook-form";
import {Textarea} from "@/components/ui/textarea";
import {RiAddLine} from "react-icons/ri";
import {IItem} from "@/components/page_components/myBlog/MyBlogUpdateProfileAddFiledModal";
import {TbCloudUpload, TbDragDrop} from "react-icons/tb";
import {MdOutlineNoPhotography} from "react-icons/md";
import Avatar from "react-avatar";
import {IoAccessibility, IoLinkOutline, IoLogoGithub, IoMailOutline} from "react-icons/io5";

const MyBlogUpdateProfileModal = () => {

    const {modalState, closeModal, openModal} = useContext(ModalContext)
    const userInfo = modalState[ModalTypes.MY_BLOG_UPDATE_PROFILE].data.userInfo
    const username = modalState[ModalTypes.MY_BLOG_UPDATE_PROFILE].data.username
    const {theme} = useTheme()
    const [addedFields, setAddedFields] = useState<string[]>([]);

    const [isDragging, setIsDragging] = useState(false); // 드래그 페이지 표시
    const [selectedProfile, setSelectedProfile] = useState<File | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // 드래그앤드롭으로 프로필 등록
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;

        if (files.length) {
            handleUploadFiles(files);
        }
    };

    // 버튼으로 프로필 등록
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
        console.log("profile", file)
        if (file && file.type.startsWith('image/')) { // 이미지 파일인지 확인
            setSelectedProfile(file);

            // 여기에 유저정보 프로필 사진 등록하는 로직 구현하기
        }
    };

    // 프로필 사진 삭제
    const deleteProfile = () => {
        setSelectedProfile(null);
    }

    const {
        watch,
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm();


    useEffect(() => {
        if (userInfo) {

            // if (userInfo.profile) {
            // 기존 프로필 값 있다면 여기에서 저장하기
            // setSelectedProfile(userInfo.profile)
            // }
            reset({
                introduce: userInfo?.introduce,
                email: userInfo.email,
                git: userInfo.git,
                profile: userInfo.profile
            })
        }
    }, [userInfo]);

    useEffect(() => {
        console.log("addedFields", addedFields)
    }, [addedFields]);

    return (
        <div
            className={`
            ${modalState[ModalTypes.MY_BLOG_UPDATE_PROFILE]?.isVisible ? "fixed z-[100] top-0 bottom-0 left-0 right-0 bg-black/70 flex w-full h-full justify-center items-center" : "hidden"}
        `}
        >
            <div
                className="flex flex-col bg-background dark:bg-neutral-700 min-h-[90vh] h-[90%] w-[90%] lg:w-[50%] rounded-lg p-6 space-y-5 overflow-y-auto"
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                }}
            >
                <div className="flex justify-center items-center">
                    <div className="font-semibold text-md">프로필 변경</div>
                </div>

                <div className="flex flex-col flex-1">
                    <div className="h-fit space-y-7">
                        <div
                            className={`${isDragging ? `bg-secondary-hover relative` : `bg-transparent`} flex flex-col flex-1 py-3`}
                            onDrop={handleDrop}
                        >
                            {isDragging &&
                                <div
                                    className="flex absolute left-2 top-2 space-x-1 items-center text-sm text-gray-500">
                                    <TbDragDrop className="w-5 h-5"/><span>여기에 드롭하세요!</span>
                                </div>
                            }

                            <div className="flex flex-1 justify-center items-center">
                                {selectedProfile ? (
                                    <img src={URL.createObjectURL(selectedProfile)} alt="Thumbnail preview"
                                         className="object-contain avatar-size rounded-[5px]"/>
                                ) : (
                                    <div className="avatar-size">
                                        <Avatar
                                            name={username}
                                            size="100%"
                                            round="5px"/>
                                    </div>
                                )}
                            </div>

                            {/* 프로필 삭제 버튼 */}
                            <div className="flex mt-3 space-x-2 justify-center items-center">
                                <Button onClick={deleteProfile}
                                        variant="secondary"
                                        className="space-x-1 font-semibold hover:bg-secondary-hover">
                                    <MdOutlineNoPhotography className="w-5 h-5"/>
                                    <span>기본 이미지</span>
                                </Button>

                                {/* 프로필 등록 버튼 */}
                                <div>
                                    <Button onClick={triggerFileInput}
                                            variant="secondary"
                                            className="space-x-1 font-semibold hover:bg-secondary-hover">
                                        <TbCloudUpload className="w-5 h-5"/>
                                        <span>버튼으로 등록</span>
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label className="flex items-center space-x-1 text-foreground"
                                   htmlFor="introduce">
                                <IoAccessibility className="w-[17px] h-[17px]"/>
                                <div>한 줄 소개</div>
                            </Label>
                            <Textarea
                                placeholder="50자 이하로 작성해주세요."
                                className="h-32 resize-none rounded placeholder:text-gray-400"
                                maxLength={50}
                                id="introduce"
                                {...register("introduce")}
                                value={watch("introduce")}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label className="flex items-center space-x-1 text-foreground" htmlFor="email">
                                <IoMailOutline className="w-[18px] h-[18px]"/>
                                <div>이메일</div>
                            </Label>
                            <Input
                                placeholder="이메일을 입력하세요."
                                className="rounded placeholder:text-gray-400"
                                id="email"
                                {...register("email")}
                                value={watch("email")}
                            />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label className="flex items-center space-x-1 text-foreground" htmlFor="git">
                                <IoLogoGithub className="w-[18px] h-[18px]"/>
                                <div>Git</div>
                            </Label>
                            <Input
                                placeholder="깃 허브 주소를 입력하세요."
                                className="rounded placeholder:text-gray-400"
                                id="git"
                                {...register("git")}
                                value={watch("git")}
                            />
                        </div>

                        {addedFields &&
                            addedFields.map((field, index) => (
                                <div key={index} className="flex flex-col space-y-1.5 animate-fadeInDown">
                                    <Label className="flex items-center space-x-1 text-foreground"
                                           htmlFor={`link-${index}`}>
                                        <IoLinkOutline className="w-[18px] h-[18px]"/>
                                        <div>링크</div>
                                    </Label>
                                    <Input
                                        className="rounded"
                                        id={`link-${index}`}
                                        // {...register(`link${index}`)}
                                        // value={watch(`link${index}`)}
                                    />
                                </div>
                            ))
                        }

                        <Button
                            onClick={() => {
                                setAddedFields([...addedFields, '']);
                            }}
                            className="w-full h-fit bg-transparent hover:bg-secondary p-1 rounded
                                    text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                        >
                            <RiAddLine className="w-6 h-6"/>
                            <span className="p-1 font-semibold">링크 추가</span>
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
                            setAddedFields([]);
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