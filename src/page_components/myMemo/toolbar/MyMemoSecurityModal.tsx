import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Bounce, toast} from "react-toastify";
import {IoIosWarning} from "react-icons/io";
import {MemoContext} from "@/context/MemoContext";
import {useUpdateMemo} from "@/openapi/api/memos/memos";
import {useTheme} from "@/context/ThemeContext";

const MyMemoSecurityModal = () => {

    const {findMyMemo, findAllMyMemo, memoId} = useContext(MemoContext);
    const {modalState, closeModal} = useContext(ModalContext);
    const {theme} = useTheme()

    const {mutate: updateMemoSecurity} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success(
                    <>
                        <div className="text-sm">성공적으로 보안이 설정되었습니다.</div>
                        <div className="text-sm">이 메모는 블로그에 개시할 수 없습니다</div>
                    </>
                    , {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                        className: "text-sm",
                    });
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
                closeModal({name: ModalTypes.MY_MEMO_SECURITY})
            },
            onError: (error) => {
                console.log(error)
                const response = error?.response?.status;
                const errorMsg1 = "한번이라도 공개된 메모는 보호 모드를 할 수 없습니다."
                const errorMsg2 = "이미 보안 설정이 되어있는 메모입니다."
                const errorMsg3 = "관리자에게 문의하세요";
                toast.error(() => {
                    if (response === 422) {
                        return errorMsg1;
                    } else if (response === 400) {
                        return errorMsg2;
                    } else {
                        return errorMsg3;
                    }
                }, {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            }
        }
    })

    const onUpdateMemoSecuritySubmit = () => updateMemoSecurity({
        memoId: memoId!,
        data: {
            security: true
        },
    })

    return (
        <Dialog open={modalState.MY_MEMO_SECURITY.isVisible}>
            <DialogContent
                className="flex flex-col max-w-[360px] h-[250px] sm:max-w-[550px] rounded-lg z-50 justify-between overflow-y-auto outline-0">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle className="flex items-center space-x-1 text-red-500">
                        <IoIosWarning className="w-6 h-6"/>
                        <div className="mt-0.5">보안 설정</div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col flex-1 items-center py-1 space-y-2">
                    <div className="">이 메모에 보안 설정을 하시겠습니까?</div>
                    <div className="text-center text-sm">보안 설정 시 이 메모는 영구적으로 블로그에 공개 및 개시될 수 없습니다.</div>
                </div>

                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className={`${findMyMemo.data?.security ? `hidden` : `flex`} w-auto`}
                        type="submit"
                        onClick={onUpdateMemoSecuritySubmit}
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
                                    name: ModalTypes.MY_MEMO_SECURITY
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

export default MyMemoSecurityModal;