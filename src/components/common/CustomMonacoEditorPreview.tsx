import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const CustomMonacoEditorPreview = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {theme} = useContext(ThemeContext)

    useEffect(() => {
        if (modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]?.isVisible === true) {
            mermaid.initialize({
                startOnLoad: false,
                theme: theme,
            });
            mermaid.run({
                querySelector: '.mermaid',
            });
        }

    }, [modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW], theme]);

    if (modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]?.isVisible === false) {
        return null;
    }

    return (
        <Dialog open={modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[90%] lg:min-w-[60%] rounded-lg z-50 dark:bg-neutral-700 h-[90vh] lg:h-[70vh] overflow-y-auto outline-0">

                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="font-bold text-xl">내 답변 미리보기</DialogTitle>

                    <DialogClose asChild className="flex">
                        <Button
                            variant="secondary"
                            className="hover:bg-secondary-hover"
                            type="button"
                            onClick={() => {
                                closeModal({name: ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW})
                            }}
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="flex flex-1 flex-col p-5 border rounded-md">
                    <div className="markdown-body w-full"
                         dangerouslySetInnerHTML={{__html: MarkdownView.render(modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].data.content)}}></div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CustomMonacoEditorPreview