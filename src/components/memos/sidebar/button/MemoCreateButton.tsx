import {MemoContext} from "@/context/MemoContext.tsx";
import {useContext} from "react";

const MemoCreateButton = () => {

    const {onMemoCreateSubmit} = useContext(MemoContext);

    return (
        <div
            className="select-none cursor-pointer"
            onClick={onMemoCreateSubmit}
        >
            <div
                className="bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2">
                <div className="text-sm cursor-pointer tracking-wider">새 메모</div>
            </div>
        </div>
    )
}

export default MemoCreateButton;