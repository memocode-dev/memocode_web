import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalConext.tsx";
import {Button} from "@/components/ui/button.tsx";
import InternalError from "@/components/common/InternalError.tsx";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {toast} from "react-toastify";
import {useFindAllMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";

const MemoSecurity = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const {memoId} = modalState[ModalTypes.MEMO_SECURITY].data

    const {refetch} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

    const {mutate: updateMemoSecurity, isError, error} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success(
                    <>
                        <div className="text-sm">성공적으로 보안이 설정되었습니다.</div>
                        <div className="text-sm">이 메모는 블로그에 개시할 수 없습니다</div>
                    </>
                );
                await refetch();
                closeModal({name: ModalTypes.MEMO_SECURITY})
            },
            onError: (error, variables, context) => {
                console.log(error)
                console.log(variables)
                console.log(context)
                if (error?.response?.status === 400) {
                    toast.error("이미 보안 설정이 되어있는 메모이며, 한번 설정한 보안은 해지할 수 없습니다.");
                } else {
                    toast.error("관리자에게 문의하세요");
                }
            }
        }
    })

    const onDeleteSubmit = () => updateMemoSecurity({
        memoId: memoId,
        data: {
            security: true
        },
    })

    const handleRemove = async () => {
        onDeleteSubmit()
    };


    if (isError) {
        console.log(error);
        return <InternalError onClick={() => refetch()}/>
    }

    return (
        <Dialog open={modalState.MEMO_SECURITY.isVisible}>
            <DialogContent
                className="flex flex-col max-w-[250px] h-[300px] sm:max-w-[550px] rounded-lg z-50 justify-between">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>! 보안 !</DialogTitle>
                    <div className="py-5">이 메모에 보안 설정을 하시겠습니까?</div>

                    <div>보안 설정 시 이 메모는 영구적으로 블로그에 공개 및 개시될 수 없습니다.</div>
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
                                closeModal({
                                    name: ModalTypes.MEMO_SECURITY
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

export default MemoSecurity;