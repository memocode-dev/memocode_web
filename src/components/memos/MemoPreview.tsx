import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {markdownView} from "@/components/common/markdown-view.ts";

const MemoPreview = ({content}: {content: string}) => {

    const {modalState, closeModal} = useContext(ModalContext);

    if (modalState[ModalTypes.MEMO_PREVIEW]?.isVisible === undefined || modalState[ModalTypes.MEMO_PREVIEW]?.isVisible === false) {
        return null;
    }

    const html = markdownView.parse(content);

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
                className="absolute right-2 top-2"
                onClick={() => closeModal({
                    name: ModalTypes.MEMO_PREVIEW,
                })}
            >닫기</Button>
            <div className="markdown-body w-full pt-12 px-[40px]" dangerouslySetInnerHTML={{__html: html}}></div>
        </div>
    )
}

export default MemoPreview;