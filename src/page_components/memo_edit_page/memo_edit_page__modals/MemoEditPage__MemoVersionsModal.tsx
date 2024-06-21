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
import MemoEditPage__MemoVersionModal
    from "@/page_components/memo_edit_page/memo_edit_page__modals/MemoEditPage__MemoVersionModal.tsx";
import MemoEditPage__MemoVersionDeleteModal
    from "@/page_components/memo_edit_page/memo_edit_page__modals/MemoEditPage__MemoVersionDeleteModal.tsx";

const MemoEditPage__MemoVersionsModal = () => {

    const {findAllMyMemoVersion} = useContext(MemoContext);
    const {modalState, closeModal, openModal} = useContext(ModalContext)
    const {memoId} = useParams()

    return (
        <>
            <Dialog open={modalState[ModalTypes.MEMO_VERSIONS].isVisible}>
                <DialogContent
                    className="flex flex-col max-w-[90%] min-h-[90vh] w-[600px] sm:min-h-[70%] rounded-lg z-50 dark:bg-neutral-700 overflow-y-auto outline-0">
                    <DialogHeader className="flex">
                        <DialogTitle>메모 버전 관리</DialogTitle>
                        <DialogDescription
                            className="flex flex-col text-gray-500 dark:text-gray-300">
                            <div className="flex">
                                <div>중요한 메모에 버전을 설정하여</div>
                                <div className="text-blue-500 dark:text-blue-400 ml-1">안전</div>
                                <div>하게 관리해보세요!</div>
                            </div>
                            <div className="flex">
                                <div>내용이</div>
                                <div className="text-red-400 mx-1">변경</div>
                                <div>또는</div>
                                <div className="text-red-400 mx-1">유실</div>
                                <div>되어도 복원이 가능합니다.</div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-1 flex-col overflow-x-auto py-2">
                        {findAllMyMemoVersion.data && findAllMyMemoVersion.data?.length > 0 ?
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-b-gray-200 dark:border-b-neutral-600">
                                        <TableHead className="text-center px-7 py-2">버전</TableHead>
                                        <TableHead className="text-center p-2">생성날짜</TableHead>
                                        <TableHead className="text-center p-2">보기</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {findAllMyMemoVersion.data?.map((memoVersion, index) => (
                                        <TableRow key={index}
                                                  className="border-b border-b-gray-200 dark:border-b-neutral-600">
                                            <TableCell
                                                className="font-medium text-center p-2">{memoVersion?.version}</TableCell>
                                            <TableCell className="text-center px-7 py-2">{
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
                                                    className="w-fit h-7 p-2">
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
                            :
                            <div className="flex flex-col flex-1 justify-center items-center text-gray-400">
                                <div>아직 관리중인 버전이 없네요!</div>
                                <div>중요한 메모가 있다면 버전을 추가해보세요.</div>
                            </div>
                        }
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
