import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Dialog, DialogClose, DialogContent, DialogHeader,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import MarkdownView from "@/components/ui/MarkdownView";
import mermaid from "mermaid";
import {useTheme} from "@/context/ThemeContext";

const CustomMonacoEditorPreview = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const {theme} = useTheme()

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
                className="flex flex-col min-w-[90%] lg:min-w-[70%] w-[70%] rounded-lg z-50 dark:bg-neutral-700 h-[90vh] outline-0">
                <DialogHeader className="flex flex-row justify-end">
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

                <div className="flex flex-1 flex-col p-5 border rounded-md overflow-y-auto">
                    <div className="markdown-body w-full"
                         dangerouslySetInnerHTML={{__html: MarkdownView.render(modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].data.content)}}></div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CustomMonacoEditorPreview