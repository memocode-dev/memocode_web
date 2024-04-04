import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";

const MemoPreview = ({content}: { content: string }) => {

    const {modalState, closeModal} = useContext(ModalContext);
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        if (modalState[ModalTypes.MEMO_PREVIEW]?.isVisible === true) {
            mermaid.initialize({
                startOnLoad: false,
                theme: theme,
            });
            mermaid.run({
                querySelector: '.mermaid',
            });
        }

    }, [modalState[ModalTypes.MEMO_PREVIEW], theme]);

    if (modalState[ModalTypes.MEMO_PREVIEW]?.isVisible === false) {
        return null;
    }

    return (
        <div
            className={`
            ${modalState[ModalTypes.MEMO_PREVIEW]?.isVisible ? "z-[1000]" : "-z-[1000]"}
            overflow-y-auto
            absolute
            bg-background
            flex w-full h-full
            `}
        >
            <Button
                onClick={() => closeModal({
                    name: ModalTypes.MEMO_PREVIEW,
                })}
                className="absolute right-2 top-2 w-auto bg-primary hover:bg-primary-hover"
                type="submit">닫기</Button>
            <div className="markdown-body w-full pt-12 px-[40px]" dangerouslySetInnerHTML={{__html: MarkdownView.render(content)}}></div>
        </div>
    )
}

export default MemoPreview;