'use client';

import {useContext, useEffect, useRef} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import MarkdownView from "@/components/ui/MarkdownView";
import mermaid from "mermaid";
import {useTheme} from "@/context/ThemeContext";
import 'katex/dist/katex.min.css';
import renderMathInElement from "katex/contrib/auto-render";

const CustomMonacoEditorPreview = () => {

    const {modalState, closeModal} = useContext(ModalContext)
    const contentRef = useRef<HTMLDivElement>(null);
    const {theme} = useTheme()

    // 마크다운 + 수식 기호 HTML로 변환
    useEffect(() => {
        if (modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].data.content) {
            if (contentRef.current) {
                // marked를 사용해 마크다운을 HTML로 변환
                const sanitizedHtml = MarkdownView.render(modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].data.content);
                contentRef.current.innerHTML = sanitizedHtml;

                // KaTeX로 수식 렌더링
                renderMathInElement(contentRef.current, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                    ],
                });
            }
        }
    }, [modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].data.content]);

    useEffect(() => {
        if (modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].data.content) {
            mermaid.initialize({
                startOnLoad: false,
                theme: theme,
            });
            mermaid.run({
                querySelector: '.mermaid',
            });
        }

    }, [modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].data.content, theme]);

    if (modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]?.isVisible === false) {
        return null;
    }

    return (
        <Dialog open={modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[90%] lg:min-w-[70%] w-[70%] rounded-lg z-50 dark:bg-neutral-700 h-[90vh] outline-0">
                <DialogHeader className="flex flex-row justify-between items-center">
                    <DialogTitle>답변 미리보기</DialogTitle>
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
                    <div ref={contentRef} className="markdown-body w-full"></div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CustomMonacoEditorPreview