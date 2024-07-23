'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {useContext, useEffect, useRef, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {MemoContext} from "@/context/MemoContext";

const MyMemoVersionsModal = () => {

    const {findAllMyMemoVersion} = useContext(MemoContext);
    const {modalState, closeModal, openModal} = useContext(ModalContext)
    const memoId = modalState[ModalTypes.MY_MEMO_VERSIONS].data.memoId
    const divRef = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number>(0);

    useEffect(() => {
        if (!divRef.current) return;

        if (modalState[ModalTypes.MY_MEMO_VERSIONS]?.isVisible === true) {
            // ResizeObserver 인스턴스 생성
            const resizeObserver = new ResizeObserver(entries => {
                const {height} = entries[0].contentRect;
                setHeight(height - 270);
            });

            // 관찰 시작
            resizeObserver.observe(divRef.current);

            // 컴포넌트가 언마운트 될 때 관찰 중단
            return () => {
                if (divRef.current) {
                    resizeObserver.unobserve(divRef.current);
                }
            };
        }
    }, [divRef.current, modalState[ModalTypes.MY_MEMO_VERSIONS]]);

    return (
        <Dialog open={modalState[ModalTypes.MY_MEMO_VERSIONS].isVisible}>
            <DialogContent
                ref={divRef}
                className="flex flex-col max-w-[90%] h-[90%] w-[600px] rounded-lg z-50 outline-0 p-4">
                <DialogHeader className="flex p-4">
                    <DialogTitle>메모 버전 관리</DialogTitle>
                    <DialogDescription
                        className="hidden xs:flex flex-col text-gray-500 dark:text-gray-300">
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
                    <DialogDescription
                        className="flex xs:hidden flex-col text-start text-gray-500 dark:text-gray-300">
                        <div>
                            중요한 메모에 버전을 설정하여
                            <span className="text-blue-500 dark:text-blue-400 ml-1">안전</span>
                            하게 관리해보세요!
                        </div>
                        <div>
                            내용이
                            <span className="text-red-400 mx-1">변경</span>
                            또는
                            <span className="text-red-400 mx-1">유실</span>
                            되어도 복원이 가능합니다.
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 flex-col py-2">
                    {findAllMyMemoVersion.data && findAllMyMemoVersion.data?.length > 0 ?
                        <Table>
                            <TableHeader>
                                <TableRow
                                    className="flex flex-1 justify-around border-b border-b-gray-200 dark:border-b-neutral-600">
                                    <TableHead className="flex items-center justify-center w-[100px]">버전</TableHead>
                                    <TableHead
                                        className="hidden sm:flex items-center justify-center w-[150px]">생성날짜</TableHead>
                                    <TableHead className="flex items-center justify-center w-[150px]">보기</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody
                                style={{height: `${height}px`}}
                                className="flex flex-col py-5 overflow-y-auto">
                                {findAllMyMemoVersion.data?.map((memoVersion, index) => (
                                    <TableRow key={index}
                                              className="flex justify-around items-center border-b border-b-gray-200 dark:border-b-neutral-600">
                                        <TableCell
                                            className="font-medium text-center p-2 w-[100px]">{memoVersion?.version}</TableCell>
                                        <TableCell
                                            className="hidden sm:flex justify-center items-center px-7 py-2 w-[150px]">{
                                            memoVersion?.createdAt
                                                ? new Date(memoVersion.createdAt).toLocaleDateString('en-CA', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                }).replace(/-/g, '.')
                                                : ''}
                                        </TableCell>
                                        <TableCell className="text-center space-y-1 space-x-1 p-2 w-[150px]">
                                            <Button
                                                onClick={() => {
                                                    openModal({
                                                        name: ModalTypes.MY_MEMO_VERSION,
                                                        data: {
                                                            memoId: memoId,
                                                            memoVersionId: memoVersion?.id
                                                        }
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
                                                        name: ModalTypes.MY_MEMO_VERSION_DELETE,
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
                                closeModal({name: ModalTypes.MY_MEMO_VERSIONS})
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

export default MyMemoVersionsModal
