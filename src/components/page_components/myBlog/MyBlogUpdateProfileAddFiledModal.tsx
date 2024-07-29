'use client'

import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {useTheme} from "@/context/ThemeContext";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";

export interface IItem {
    id: string;
    label: string;
}

const MyBlogUpdateProfileAddFiledModal = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const [selectedItems, setSelectedItems] = useState<IItem[]>([]);
    const {setAddedFiled} = modalState[ModalTypes.MY_BLOG_UPDATE_PROFILE_ADD_FILED].data
    const {theme} = useTheme()

    const items = [
        {id: "git", label: '깃'},
        {id: "birth", label: '생년월일'},
        {id: "phone", label: '핸드폰'},
        {id: "addedLinks", label: '링크'}
    ];

    const handleCheckboxChange = (item: IItem) => {
        setSelectedItems((prevSelected: IItem[]) =>
            prevSelected.some(selectedItem => selectedItem.id === item.id)
                ? prevSelected.filter(selectedItem => selectedItem.id !== item.id)
                : [...prevSelected, item]
        );
    };

    return (
        <div
            className={`
            ${modalState[ModalTypes.MY_BLOG_UPDATE_PROFILE_ADD_FILED]?.isVisible ? "fixed z-[100] top-0 bottom-0 left-0 right-0 bg-black/70 flex w-full h-full justify-center items-center" : "hidden"}
        `}
        >
            <div
                className="flex flex-col bg-background dark:bg-neutral-700 min-h-[90vh] h-[90%] w-[90%] lg:w-[50%] rounded-lg p-6 space-y-5">
                <div className="flex justify-center items-center">
                    <div>정보 추가</div>
                </div>

                <div className="flex flex-col py-5">
                    <div className="space-y-2 justify-center">
                        {items.map((item) => (
                            <Label
                                key={item.id}
                                htmlFor={`checkbox-${item.id}`}
                                className="flex border rounded-md p-4 space-x-3 cursor-pointer"
                            >
                                <Checkbox
                                    id={`checkbox-${item.id}`}
                                    checked={selectedItems.some(selectedItem => selectedItem.id === item.id)}
                                    onCheckedChange={() => handleCheckboxChange(item)}
                                />
                                <div className="text-sm font-medium leading-none">
                                    {item.label}
                                </div>
                            </Label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-row justify-center sm:justify-center space-x-1">
                    <Button
                        onClick={() => {
                            setAddedFiled(selectedItems)
                            closeModal({
                                name: ModalTypes.MY_BLOG_UPDATE_PROFILE_ADD_FILED
                            });
                        }}
                        type="button"
                        className="rounded"
                    >
                        저장
                    </Button>

                    <Button
                        onClick={() => {
                            closeModal({
                                name: ModalTypes.MY_BLOG_UPDATE_PROFILE_ADD_FILED
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

export default MyBlogUpdateProfileAddFiledModal;