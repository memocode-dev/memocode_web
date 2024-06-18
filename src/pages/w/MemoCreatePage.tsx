import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";

const MemoCreatePage = () => {

    const {openModal} = useContext(ModalContext)

    return (
        <div className="flex-1 flex justify-center items-center bg-background">
            <Button
                className="px-10 py-7 hover:scale-110 transform transition duration-300 rounded-lg shadow"
                onClick={() => {
                    openModal({
                        name: ModalTypes.CREATE_MEMO_DETAIL_INFO,
                    })
                }}
            >
                <div className="text-[16px]">새 메모 시작하기</div>
            </Button>
        </div>
    )
}

export default MemoCreatePage;