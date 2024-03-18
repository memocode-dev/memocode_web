import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import MarkdownView from "@/components/common/MarkdownView.ts";

const MemoPreview = ({content}: { content: string }) => {

    const {modalState, closeModal} = useContext(ModalContext);

    if (modalState[ModalTypes.MEMO_PREVIEW]?.isVisible === undefined || modalState[ModalTypes.MEMO_PREVIEW]?.isVisible === false) {
        return null;
    }

    const html = MarkdownView.render(content);

    return (
        <div
            className={`
            ${modalState[ModalTypes.MEMO_PREVIEW]?.isVisible ? "z-[1000]" : "-z-[1000]"}
            overflow-y-auto
            absolute
            bg-white dark:bg-[#1E1E1E]
            flex w-full
            h-[95vh]
            `}
        >

            <Button
                onClick={() => closeModal({
                    name: ModalTypes.MEMO_PREVIEW,
                })}
                className="absolute right-2 top-2 w-full sm:w-auto bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 dark:text-white"
                type="submit">닫기</Button>
            <div className="markdown-body w-full pt-12 px-[40px]" dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    )
}

export default MemoPreview;