import {useContext, useEffect, useRef} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Button} from "@/components/ui/button";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext";
import MarkdownView from "@/components/ui/MarkdownView";
import 'katex/dist/katex.min.css';
import renderMathInElement from "katex/contrib/auto-render";

const MyMemoPreviewModal = ({content}: { content: string }) => {

    const {modalState, closeModal} = useContext(ModalContext);
    const {theme} = useContext(ThemeContext);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // 마크다운 + 수식 기호 HTML로 변환
    useEffect(() => {
        if (modalState[ModalTypes.MY_MEMO_PREVIEW]?.isVisible === true) {
            if (contentRef.current) {
                // marked를 사용해 마크다운을 HTML로 변환
                const sanitizedHtml = MarkdownView.render(content);
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
    }, [modalState[ModalTypes.MY_MEMO_PREVIEW], content]);

    useEffect(() => {
        if (modalState[ModalTypes.MY_MEMO_PREVIEW]?.isVisible === true) {
            mermaid.initialize({
                startOnLoad: false,
                theme: theme,
            });
            mermaid.run({
                querySelector: '.mermaid',
            });
        }
    }, [modalState[ModalTypes.MY_MEMO_PREVIEW], theme]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (modalRef.current && !modalRef.current.contains(target)) {
                closeModal({
                    name: ModalTypes.MY_MEMO_PREVIEW,
                });
            }
        };

        if (modalState[ModalTypes.MY_MEMO_PREVIEW]?.isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalState[ModalTypes.MY_MEMO_PREVIEW], closeModal]);

    if (modalState[ModalTypes.MY_MEMO_PREVIEW]?.isVisible === false) {
        return null;
    }

    return (
        <div
            ref={modalRef}
            className={`
            ${modalState[ModalTypes.MY_MEMO_PREVIEW]?.isVisible ? "z-[1000]" : "-z-[1000]"}
            overflow-y-auto
            absolute
            bg-background
            flex w-full h-full
        `}
        >
            <Button
                onClick={() => closeModal({name: ModalTypes.MY_MEMO_PREVIEW})}
                className="absolute right-2 top-2 w-auto"
                type="submit">
                닫기
            </Button>

            <div ref={contentRef}
                 className="markdown-body w-full pt-12 px-[40px]"></div>
        </div>
    )
        ;
}

export default MyMemoPreviewModal;
