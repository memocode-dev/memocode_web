import {IoSearch} from "react-icons/io5";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import MemoSearch from "@/components/memos/sidebar/MemoSearch.tsx";

const MemoSearchButton = () => {

    const {openModal} = useContext(ModalContext)

    return (
        <>
            <div
                onClick={() => {
                    openModal({
                        name: ModalTypes.MEMO_SEARCH,
                    })
                }}>
                <div
                    className="flex space-x-2 items-center bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer">
                    <IoSearch className="w-[17px] h-[17px]"/>
                    <div className="text-sm tracking-wider">검색</div>
                </div>
            </div>

            <MemoSearch/>
        </>
    )
}

export default MemoSearchButton