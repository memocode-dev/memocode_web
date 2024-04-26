import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {toast} from "react-toastify";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {MemoContext} from "@/context/MemoContext.tsx";
import {useDeleteMemoVersion} from "@/openapi/api/memos-memoversions/memos-memoversions.ts";

const MemoVersionDelete = () => {

    const {findAllMyMemoVersion} = useContext(MemoContext);
    const {modalState, closeModal} = useContext(ModalContext);
    const {memoId, memoVersionId} = modalState.MEMO_VERSION_DELETE.data;

    const {mutate: deleteMemoVersion} = useDeleteMemoVersion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모버전이 삭제되었습니다.");
                await findAllMyMemoVersion.refetch();
                closeModal({name: ModalTypes.MEMO_VERSION_DELETE})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            },
        }
    })

    const onDeleteSubmit = () => deleteMemoVersion({memoId: memoId, memoVersionId: memoVersionId})

    const handleRemove = async () => {
        onDeleteSubmit()
    };

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
                        className="w-auto text-primary-foreground bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="submit"
                        onClick={handleRemove}
                    >
                        확인
                    </Button>
                    <DialogClose asChild>
                        <Button
                            className="hover:bg-secondary-hover"
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