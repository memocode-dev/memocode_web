import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useContext} from "react";
import {Bounce, toast} from "react-toastify";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {MemoContext} from "@/context/MemoContext";
import {useTheme} from "@/context/ThemeContext";
import {useDeleteMemoVersion} from "@/openapi/api/memos/memos";

const MyMemoDeleteVersionModal = () => {

    const {findAllMyMemoVersion} = useContext(MemoContext);
    const {modalState, closeModal} = useContext(ModalContext);
    const {memoId, memoVersionId} = modalState.MY_MEMO_VERSION_DELETE.data;
    const {theme} = useTheme()

    const {mutate: deleteMemoVersion} = useDeleteMemoVersion({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모버전이 삭제되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await findAllMyMemoVersion.refetch();
                closeModal({name: ModalTypes.MY_MEMO_VERSION_DELETE})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            },
        }
    })

    const onDeleteSubmit = () => {
        deleteMemoVersion({memoId: memoId, memoVersionId: memoVersionId})
    }

    return (
        <Dialog open={modalState.MY_MEMO_VERSION_DELETE.isVisible}>
            <DialogContent
                className="flex flex-col max-w-[90%] h-[200px] w-[300px] rounded-lg z-50">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>삭제</DialogTitle>
                    <div className="py-5">메모를 삭제하시겠습니까?</div>
                </DialogHeader>
                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto"
                        type="submit"
                        onClick={onDeleteSubmit}
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
                                    name: ModalTypes.MY_MEMO_VERSION_DELETE
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

export default MyMemoDeleteVersionModal