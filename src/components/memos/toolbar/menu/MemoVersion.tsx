import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useFindMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import InternalError from "@/components/common/InternalError.tsx";
import MarkdownView from "@/components/common/MarkdownView.ts";

const MemoVersion = () => {

    const {modalState, closeModal, openModal} = useContext(ModalContext);
    const {memoId, memoVersionId} = modalState[ModalTypes.MEMO_VERSION].data

    const {isError, error, data: memoVersion, refetch} =
        useFindMemoVersion(
            memoId,
            memoVersionId,
            {
                query: {
                    queryKey: ["memoVersion", memoId, memoVersionId]
                }
            })

    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    const html = MarkdownView.render(memoVersion?.content || '');

    return (
        <div
            className={`fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[100] !m-0
              ${modalState.MEMO_VERSION.isVisible ? "flex" : "hidden"}
              `}>
            <div className="absolute inset-0 bg-black/80"></div>
            <div
                className="flex flex-1 w-[90%] lg:w-[80%] h-full max-h-[90vh] max-w-[90vw] rounded-lg bg-white z-[1000] p-10">

                <div className="flex flex-1">
                    {memoVersion?.title}
                    {memoVersion?.content}
                    {memoVersion?.createdAt}
                   수정일 {memoVersion?.updatedAt}
                </div>

                <div className="markdown-body w-full pt-12 px-[40px]"
                     dangerouslySetInnerHTML={{__html: html}}></div>

                <div className="flex items-end">
                    <div className="flex">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                closeModal({
                                    name: ModalTypes.MEMO_VERSION
                                });
                                openModal({
                                    name: ModalTypes.MEMO_VERSIONS
                                });
                            }}
                        >
                            닫기
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MemoVersion;