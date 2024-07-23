'use client'

import React, {useContext} from "react";
import {useSidebar} from "@/context/SideBarContext";
import {Button} from "@/components/ui/button";
import {ModalContext, ModalTypes} from "@/context/ModalContext";

const MyMemoCreatePage = () => {

    const {sidebarWidth} = useSidebar()
    const {openModal} = useContext(ModalContext)

    return (
        <div className="flex-1 flex flex-col" style={{marginLeft: `${sidebarWidth}px`}}>
            <div className="flex-1 flex justify-center items-center bg-background">
                <Button
                    className="px-10 py-7 hover:scale-110 transform transition duration-300 rounded-lg shadow"
                    onClick={() => {
                        openModal({
                            name: ModalTypes.MY_MEMO_CREATE_DETAIL_INFO,
                        })
                    }}
                >
                    <div className="text-[16px]">새 메모 시작하기</div>
                </Button>
            </div>
        </div>
    )
}

export default MyMemoCreatePage;