import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {toast} from "react-toastify";
import {useDeleteMemoVersion, useFindAllMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import InternalError from "@/components/common/InternalError.tsx";

const MemoVersionDelete = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const {memoId, memoVersionId} = modalState.MEMO_VERSION_DELETE.data

    const {refetch} =
        useFindAllMemoVersion(
            memoId,
            {
                page: 0,
                size: 10,
            },
            {
                query: {
                    queryKey: ["memoVersions", memoId]
                }
            })

    const {mutate: deleteMemoVersion, isError, error} = useDeleteMemoVersion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모버전이 삭제되었습니다.");
                await refetch();
                closeModal({name: ModalTypes.MEMO_VERSION_DELETE})
            },
            onError: (error, variables, context) => {
                console.log(error)
                console.log(variables)
                console.log(context)
                toast.error("관리자에게 문의하세요");
            }
        }
    })

    const onDeleteSubmit = () => deleteMemoVersion({memoId: memoId, memoVersionId: memoVersionId})

    const handleRemove = async () => {
        onDeleteSubmit()
    };

    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    return (
        <Dialog open={modalState.MEMO_VERSION_DELETE.isVisible}>
            <DialogContent
                className="flex flex-col max-w-[250px] h-[200px] sm:max-w-[300px] rounded-lg z-50 dark:bg-neutral-700">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>삭제</DialogTitle>
                    <div className="py-5">메모를 삭제하시겠습니까?</div>
                </DialogHeader>
                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto text-white bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="submit"
                        onClick={handleRemove}
                    >
                        확인
                    </Button>
                    <DialogClose asChild>
                        <Button
                            className="dark:bg-neutral-800 dark:hover:bg-neutral-500"
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                closeModal({
                                    name: ModalTypes.MEMO_VERSION_DELETE
                                });
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

export default MemoVersionDelete