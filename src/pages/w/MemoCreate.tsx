import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext.tsx";

const MemoCreate = () => {

    const {onMemoCreateSubmit} = useContext(MemoContext);

    return (
        <div className="flex-1 flex justify-center items-center bg-white dark:bg-[#1E1E1E]">
            <Button
                className="px-10 py-7 bg-indigo-400 dark:bg-indigo-700 dark:hover:bg-indigo-800 hover:bg-indigo-500 hover:scale-110 transform transition duration-300 rounded-lg shadow"
                onClick={onMemoCreateSubmit}
            >
                <div className="text-white text-[16px]">새 메모 시작하기</div>
            </Button>
        </div>
    )
}

export default MemoCreate;