import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useFindMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import InternalError from "@/components/ui/InternalError.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";

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
                className="flex flex-1 relative w-[90%] lg:w-[80%] h-full max-h-[90vh] max-w-[90vw] rounded-lg bg-white dark:bg-neutral-700 z-[1000]">

                <div className="flex flex-col flex-1 overflow-y-auto pb-12 p-10">

                    <div className="flex items-center justify-between bg-white dark:bg-neutral-700 border-b border-b-gray-300 p-5">
                        <div className="text-2xl font-bold leading-snug break-all truncate">
                            {memoVersion?.title}
                        </div>

                        <div className="text-gray-500 dark:text-gray-300 tracking-wider">
                            {memoVersion?.createdAt
                                ? new Date(memoVersion.createdAt).toLocaleDateString('en-CA', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).replace(/-/g, '.')
                                : ''}
                        </div>
                    </div>

                    <div
                        className="markdown-body w-full pt-5 px-[40px]"
                        dangerouslySetInnerHTML={{__html: html}}></div>

                </div>
                <div className="absolute bottom-4 right-8">
                    <div className="flex">
                        <Button
                            className="hover:bg-secondary-hover"
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