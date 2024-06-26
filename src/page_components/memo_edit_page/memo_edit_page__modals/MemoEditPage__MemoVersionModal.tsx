import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import InternalError from "@/components/ui/InternalError.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useFindMyMemoVersion} from "@/openapi/api/users-memoversions/users-memoversions.ts";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";

const MemoEditPage__MemoVersionModal = () => {

    const {theme} = useContext(ThemeContext);
    const {modalState, closeModal} = useContext(ModalContext);
    const {memoId, memoVersionId} = modalState[ModalTypes.MEMO_VERSION].data

    const {isError, error, data: memoVersion, refetch} =
        useFindMyMemoVersion(
            memoId,
            memoVersionId,
            {
                query: {
                    queryKey: ["memoVersion", memoId, memoVersionId]
                }
            })

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [memoVersion, theme]);

    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    return (
        <Dialog open={modalState[ModalTypes.MEMO_VERSION].isVisible}>
            <DialogContent
                className="flex flex-col max-w-[90%] min-h-[90vh] w-[70%] rounded-lg z-50 overflow-y-auto outline-0">
                <DialogHeader>
                    <DialogTitle className="flex justify-between border-b border-b-secondary pb-4 px-2">
                        <div className="flex space-x-1">
                            <div>버전 :</div>
                            <div>{memoVersion?.version}</div>
                        </div>

                        <div className="tracking-wider">
                            {memoVersion?.createdAt
                                ? new Date(memoVersion.createdAt).toLocaleDateString('en-CA', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).replace(/-/g, '.')
                                : ''}
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-1 overflow-y-auto px-5">
                    <div
                        className="markdown-body"
                        dangerouslySetInnerHTML={{__html: MarkdownView.render(memoVersion?.content || '')}}></div>
                </div>

                <DialogFooter className="flex items-end">
                    <DialogClose asChild className="flex">
                        <Button
                            variant="secondary"
                            className="hover:bg-secondary-hover"
                            type="button"
                            onClick={() => {
                                closeModal({name: ModalTypes.MEMO_VERSION})
                            }}
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MemoEditPage__MemoVersionModal;