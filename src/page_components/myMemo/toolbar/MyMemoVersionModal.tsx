import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Button} from "@/components/ui/button";
import MarkdownView from "@/components/ui/MarkdownView";
import mermaid from "mermaid";
import {useFindMyMemoVersion} from "@/openapi/api/users-memoversions/users-memoversions";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTheme} from "@/context/ThemeContext";
import InternalError from "@/pages/error/InternalError";

const MyMemoVersionModal = () => {

    const {theme} = useTheme()
    const {modalState, closeModal} = useContext(ModalContext);
    const {memoId, memoVersionId} = modalState[ModalTypes.MY_MEMO_VERSION].data

    const {isError, error, data: memoVersion, refetch} =
        useFindMyMemoVersion(
            memoId,
            memoVersionId,
            {
                query: {
                    queryKey: ["MyMemoVersionModal", memoId, memoVersionId]
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
        <Dialog open={modalState[ModalTypes.MY_MEMO_VERSION].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[90%] lg:min-w-[70%] min-h-[90vh] h-[90%] p-2 sm:p-4 rounded-lg z-50 outline-0">
                <DialogHeader>
                    <DialogTitle className="flex justify-between border-b border-b-secondary p-4">
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

                <div className="grid grid-cols-1 overflow-y-auto flex-1 p-2 sm:p-5">
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
                                closeModal({name: ModalTypes.MY_MEMO_VERSION})
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

export default MyMemoVersionModal;