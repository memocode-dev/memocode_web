import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";

const MemoCreatePage = () => {

    const {openModal} = useContext(ModalContext)
    const {onMemoCreateSubmit} = useContext(MemoContext);

    return (
        <div className="flex-1 flex justify-center items-center bg-background">
            <Button
                className="px-10 py-7 bg-primary hover:bg-primary-hover hover:scale-110 transform transition duration-300 rounded-lg shadow"
                onClick={() => {
                    onMemoCreateSubmit();
                    openModal({
                        name: ModalTypes.MEMO_REPRESENTATIVE,
                    })
                }}
            >
                <div className="text-[16px]">새 메모 시작하기</div>
            </Button>
        </div>
    )
}

export default MemoCreatePage;