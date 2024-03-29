import {MemoContext} from "@/context/MemoContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useContext} from "react";
import MemoRepresentative from "@/components/memos/sidebar/MemoRepresentative.tsx";
import {FaPen} from "react-icons/fa6";


const MemoCreateButton = () => {

    const {openModal} = useContext(ModalContext)
    const {onMemoCreateSubmit} = useContext(MemoContext)

    return (
        <>
            <div
                onClick={() => {
                    onMemoCreateSubmit();
                    openModal({
                        name: ModalTypes.MEMO_REPRESENTATIVE,
                    })
                }}
                className="flex items-center space-x-2.5 bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer">
                <FaPen className="w-[15px] h-[15px]" />
                <div className="text-sm tracking-wider">새 메모</div>
            </div>

            <MemoRepresentative/>
        </>
    )
}

export default MemoCreateButton;