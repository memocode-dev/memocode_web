import {MemoContext} from "@/context/MemoContext.tsx";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import MemoRepresentative from "@/components/memos/sidebar/MemoRepresentative.tsx";

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
                className="bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2">
                <div className="text-sm cursor-pointer tracking-wider">새 메모</div>
            </div>

            <MemoRepresentative/>
        </>
    )
}

export default MemoCreateButton;