import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import InternalError from "@/components/common/InternalError.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {toast} from "react-toastify";
import {useFindAllMemo, useFindMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import {IoIosWarning} from "react-icons/io";
import {ErrorResponse} from "@/vite-env";

const MemoSecurity = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const {memoId} = modalState[ModalTypes.MEMO_SECURITY].data

    const {refetch} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

    /* 메모 단건 조회 */
    const {refetch: refetchMemo, data: memo} = useFindMemo(memoId!, {
        query: {
            queryKey: ["MemoEdit", memoId!]
        }
    })

    console.log("memo", memo)

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
                await refetchMemo();
                closeModal({name: ModalTypes.MEMO_SECURITY})
            },
            onError: (error, variables, context) => {
                console.log(error)
                console.log(variables)
                console.log(context)
                if (error?.response?.status === 400) {
                    const errorResponse = error?.response?.data as ErrorResponse;
                    if (errorResponse.codeString === "PROTECT_MODE_DISABLED_ONCE_PUBLIC") {
                        toast.error("한번이라도 공개된 메모는 보호 모드를 하실 수 없습니다.");
                        return;
                    }

                    if (errorResponse.codeString === "PROTECT_MEMO_SECURITY_UNMODIFIED") {
                        toast.error("이미 보안 설정이 되어있는 메모입니다.");
                    }
                } else {
                    toast.error("관리자에게 문의하세요");
                }
            }
        }
    })

    const onDeleteSubmit = () => updateMemoSecurity({
        memoId: memoId!,
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
                className="flex flex-col max-w-[250px] h-[250px] sm:max-w-[550px] rounded-lg z-50 justify-between dark:bg-neutral-700">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle className="flex items-center space-x-1 text-red-500">
                        <IoIosWarning className="w-7 h-7"/>
                        <div className="mt-0.5">보안 설정</div>
                    </DialogTitle>
                </DialogHeader>


                {memo?.security ?
                    <div className="flex flex-col flex-1 items-center py-1 space-y-2">
                        <div className="text-lg">이 메모는 이미 보안이 활성화된 메모입니다</div>
                        <div>한번 설정한 보안은 해지할 수 없습니다.</div>
                    </div>
                    :
                    <div className="flex flex-col flex-1 items-center py-1 space-y-2">
                        <div className="text-lg">이 메모에 보안 설정을 하시겠습니까?</div>
                        <div>보안 설정 시 이 메모는 영구적으로 블로그에 공개 및 개시될 수 없습니다.</div>
                    </div>
                }

                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className={`${memo?.security ? `hidden`: `flex`} w-auto bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0`}
                        type="submit"
                        onClick={handleRemove}
                    >
                        확인
                    </Button>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            className="dark:bg-neutral-800 dark:hover:bg-neutral-500"
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