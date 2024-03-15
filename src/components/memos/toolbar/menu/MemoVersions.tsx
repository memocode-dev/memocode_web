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
import {ModalContext, ModalTypes} from "@/context/ModalConext.tsx";
import {useFindAllMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";
import {useParams} from "react-router-dom";
import MemoVersion from "@/components/memos/toolbar/menu/MemoVersion.tsx";
import MemoVersionDelete from "@/components/memos/toolbar/menu/MemoVersionDelete.tsx";

const MemoVersions = () => {

    const {modalState, closeModal, openModal} = useContext(ModalContext)
    const {memoId} = useParams()

    const {data: memoVersions} =
        useFindAllMemoVersion(
            memoId!,
            {
                page: 0,
                size: 10,
            },
            {
                query: {
                    queryKey: ["memoVersions", memoId]
                }
            })

    return (
        <>
            <Dialog open={modalState[ModalTypes.MEMO_VERSIONS].isVisible}>
                <DialogContent
                    className="flex flex-col max-w-[250px] h-[500px] sm:max-w-[620px] lg:max-w-[825px] rounded-lg z-50">
                    <DialogHeader className="flex">
                        <DialogTitle>메모 버전 관리</DialogTitle>
                        <DialogDescription className="flex flex-col lg:flex-row lg:space-x-1 text-gray-500">
                            <span>중요한 메모에 버전을 설정하여 <span className="text-blue-500">안전</span>하게 관리해보세요!</span>
                            <span>내용이 <span className="text-red-400">변경</span> 또는 <span
                                className="text-red-400">유실</span> 되어도 복원이 가능합니다.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-1 flex-col overflow-x-auto py-2 sm:px-10">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">버전</TableHead>
                                    <TableHead className="text-center">생성날짜</TableHead>
                                    <TableHead className="text-center">보기</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {memoVersions?.content?.map((memoVersion, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            className="font-medium text-center">{memoVersion?.version}</TableCell>
                                        <TableCell className="text-center">{memoVersion?.createdAt}</TableCell>
                                        <TableCell className="text-center space-x-1">
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
                                                className="w-fit h-7 bg-indigo-400 hover:bg-indigo-500">
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
                                type="button"
                                variant="secondary"
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

            <MemoVersion/>
            <MemoVersionDelete/>
        </>
    )
}

export default MemoVersions
