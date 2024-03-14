import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext, useState} from "react";
import {toast} from "react-toastify";
import {useDeleteMemoVersion, useFindAllMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import {ModalContext, ModalTypes} from "@/context/ModalConext.tsx";

const MemoVersionDelete = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setShowRemoveModal] = useState<boolean>(false);
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

    const {mutate: deleteMemoVersion} = useDeleteMemoVersion({
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

    return (
        <Dialog open={modalState.MEMO_VERSION_DELETE.isVisible}>
            <DialogTrigger asChild onClick={() => setShowRemoveModal(true)}>
                <div
                    className="flex items-center bg-transparent hover:bg-gray-200 hover:bg-opacity-50 dark:hover:bg-black rounded-sm py-1 px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
                         className="-mt-[2px] ml-1 mr-2">
                        <path
                            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                    <span className="text-sm cursor-pointer tracking-wider">삭제</span>
                </div>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col max-w-[250px] h-[200px] sm:max-w-[300px] rounded-lg z-50">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>삭제</DialogTitle>
                    <div className="py-5">메모를 삭제하시겠습니까?</div>
                </DialogHeader>
                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto bg-indigo-400 hover:bg-indigo-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="submit"
                        onClick={handleRemove}
                    >
                        확인
                    </Button>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setShowRemoveModal(false);
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