'use client';

import {IoSearch} from "react-icons/io5";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import MyMemoSearchModal from "@/components/page_components/myMemo/layout/MyMemoSearchModal";

const MyMemoSearchButton = () => {

    const {openModal} = useContext(ModalContext)

    return (
        <>
            <div
                onClick={() => {
                    openModal({
                        name: ModalTypes.MY_MEMO_SEARCH,
                    })
                }}>
                <div
                    className="flex space-x-2 items-center bg-transparent hover:bg-secondary dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer">
                    <IoSearch className="w-[18px] h-[18px]"/>
                    <div className="text-sm tracking-wider">검색</div>
                </div>
            </div>

            <MyMemoSearchModal/>
        </>
    )
}

export default MyMemoSearchButton