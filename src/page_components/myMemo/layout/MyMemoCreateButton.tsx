'use client';

import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {useContext} from "react";
import {FaPen} from "react-icons/fa6";

const MyMemoCreateButton = () => {

    const {openModal} = useContext(ModalContext)

    return (
        <div
            onClick={() => {
                openModal({
                    name: ModalTypes.MY_MEMO_CREATE_DETAIL_INFO,
                })
            }}
            className="flex items-center space-x-2.5 bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer">
            <FaPen className="w-[15px] h-[15px]"/>
            <div className="text-sm tracking-wider">새 메모</div>
        </div>
    )
}

export default MyMemoCreateButton;