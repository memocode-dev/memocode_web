'use client';

import {useContext, useEffect, useRef} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
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
        if (modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]?.isVisible === true) {
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
    }, [modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]]);

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
        <div
            className={`
            ${modalState[ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]?.isVisible ? "z-[1000]" : "-z-[1000]"}
            fixed
            bg-black/60
            flex w-full h-full justify-center items-center
        `}
        >

            <div
                className="flex flex-col bg-background dark:bg-neutral-700 min-h-[90vh] h-[90%] w-[90%] lg:w-[70%] rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>미리보기</div>
                    <div className="flex">
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
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-5 border rounded-md overflow-y-auto">
                    <div ref={contentRef} className="markdown-body w-full"></div>
                </div>
            </div>
        </div>
    )
}

export default CustomMonacoEditorPreview