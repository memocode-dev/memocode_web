import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useContext} from "react";
import {FaPen} from "react-icons/fa6";
import MemoWritePageLayout__MemoDetailInfoModal
    from "@/page_components/memo_write_page_layout/memo_write_page_layout__modals/MemoWritePageLayout__MemoDetailInfoModal.tsx";

const MemoWritePageLayout__MemoCreateButton = () => {

    const {openModal} = useContext(ModalContext)

    return (
        <>
            <div
                onClick={() => {
                    openModal({
                        name: ModalTypes.MEMO_DETAIL_INFO,
                        data: {
                            createNewMemo: true
                        }
                    })
                }}
                className="flex items-center space-x-2.5 bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer">
                <FaPen className="w-[15px] h-[15px]"/>
                <div className="text-sm tracking-wider">새 메모</div>
            </div>

            <MemoWritePageLayout__MemoDetailInfoModal/>
        </>
    )
}

export default MemoWritePageLayout__MemoCreateButton;