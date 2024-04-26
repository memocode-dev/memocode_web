import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {useParams} from "react-router-dom";
import {MemoContext} from "@/context/MemoContext.tsx";
import MemoEditPage__MemoVersionModal from "@/page_components/memo_edit_page/memo_edit_page__modals/MemoEditPage__MemoVersionModal.tsx";
import MemoEditPage__MemoVersionDeleteModal from "@/page_components/memo_edit_page/memo_edit_page__modals/MemoEditPage__MemoVersionDeleteModal.tsx";

const MemoEditPage__MemoVersionsModal = () => {

    const {findAllMyMemoVersion} = useContext(MemoContext);
    const {modalState, closeModal, openModal} = useContext(ModalContext)
    const {memoId} = useParams()

    return (
        <>
            <Dialog open={modalState[ModalTypes.MEMO_VERSIONS].isVisible}>
                <DialogContent
                    className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 dark:bg-neutral-700 h-[90vh] overflow-y-auto outline-0">
                    <DialogHeader className="flex">
                        <DialogTitle>메모 버전 관리</DialogTitle>
                        <DialogDescription className="flex flex-col lg:flex-row lg:space-x-1 text-gray-500 dark:text-gray-300">
                            <span>중요한 메모에 버전을 설정하여 <span className="text-blue-500 dark:text-blue-400">안전</span>하게 관리해보세요!</span>
                            <span>내용이 <span className="text-red-400">변경</span> 또는 <span
                                className="text-red-400">유실</span> 되어도 복원이 가능합니다.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-1 flex-col overflow-x-auto py-2 sm:px-10">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-b-gray-200 dark:border-b-neutral-600">
                                    <TableHead className="text-center">버전</TableHead>
                                    <TableHead className="text-center">생성날짜</TableHead>
                                    <TableHead className="text-center">보기</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {findAllMyMemoVersion.data?.map((memoVersion, index) => (
                                    <TableRow key={index} className="border-b border-b-gray-200 dark:border-b-neutral-600">
                                        <TableCell
                                            className="font-medium text-center p-2">{memoVersion?.version}</TableCell>
                                        <TableCell className="text-center p-2">{
                                            memoVersion?.createdAt
                                                ? new Date(memoVersion.createdAt).toLocaleDateString('en-CA', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                }).replace(/-/g, '.')
                                                : ''}
                                        </TableCell>
                                        <TableCell className="text-center space-y-1 space-x-1 p-2">
                                            <Button
                                                onClick={() => {
                                                    openModal({
                                                        name: ModalTypes.MEMO_VERSION,
                                                        data: {
                                                            memoId: memoId,
                                                            memoVersionId: memoVersion?.id
                                                        }
                                                    });
                                                    closeModal({
                                                        name: ModalTypes.MEMO_VERSIONS
                                                    });
                                                }}
                                                className="w-fit h-7 bg-primary hover:bg-primary-hover">
                                                내용보기
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="w-fit h-7"
                                                onClick={() => {
                                                    openModal({
                                                        name: ModalTypes.MEMO_VERSION_DELETE,
                                                        data: {
                                                            memoId: memoId,
                                                            memoVersionId: memoVersion?.id
                                                        }
                                                    });
                                                }}
                                            >
                                                삭제
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <DialogFooter className="flex items-end">
                        <DialogClose asChild className="flex">
                            <Button
                                variant="secondary"
                                className="hover:bg-secondary-hover"
                                type="button"
                                onClick={() => {
                                    closeModal({name: ModalTypes.MEMO_VERSIONS})
                                }}
                            >
                                닫기
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MemoEditPage__MemoVersionModal/>
            <MemoEditPage__MemoVersionDeleteModal/>
        </>
    )
}

export default MemoEditPage__MemoVersionsModal
