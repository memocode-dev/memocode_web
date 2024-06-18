import {useContext, useEffect} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MemoContext} from "@/context/MemoContext.tsx";
import {Bounce, toast} from "react-toastify";
import {useCreateMemo} from "@/openapi/api/memos/memos.ts";
import MemoWritePageLayout__MemoDetailForm
    from "@/page_components/memo_write_page_layout/memo_wrtie_page_layout_form/MemoWritePageLayout__MemoDetailForm.tsx";
import {useForm} from "react-hook-form";
import {CreateMemoForm} from "@/openapi/model";
import {useNavigate} from "react-router-dom";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const MemoWritePageLayout__CreateMemoDetailInfoModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext);

    const {
        // findMyMemo,
        findAllMyMemo,
    } = useContext(MemoContext);

    const createMemoForm = useForm<CreateMemoForm>({
        defaultValues: {
            title: "",
            content: "",
            summary: "",
            tags: [],
            security: false,
        },
    });

    const {mutate: createMemo} = useCreateMemo({
        mutation: {
            onSuccess: async (memo_id) => {
                toast.success("성공적으로 메모가 생성되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                // await findMyMemo.refetch();
                await findAllMyMemo.refetch();
                navigate(`/w/${memo_id}`);
                closeModal({name: ModalTypes.CREATE_MEMO_DETAIL_INFO})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요");
            },
        }
    })

    const handleSave = () => {
        createMemo({
            data: createMemoForm.getValues(),
        });
    }

    const handleClose = () => {
        closeModal({name: ModalTypes.CREATE_MEMO_DETAIL_INFO})
    }

    useEffect(() => {
        if (!modalState[ModalTypes.CREATE_MEMO_DETAIL_INFO].isVisible) {
            createMemoForm.reset();
        }
    }, [modalState[ModalTypes.CREATE_MEMO_DETAIL_INFO]]);

    return (
        <Dialog open={modalState[ModalTypes.CREATE_MEMO_DETAIL_INFO].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 dark:bg-neutral-700 h-[90vh] overflow-y-auto outline-0">
                <DialogHeader>
                    <DialogTitle>메모 등록하기</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-300">
                        메모의 상세정보를 작성해보세요! 블로그에 게시되면 다른 사람들도 볼 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <MemoWritePageLayout__MemoDetailForm form={createMemoForm} />

                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <DialogClose asChild>
                        <Button
                            className="w-auto"
                            type="submit"
                            onClick={handleSave}
                        >
                            저장
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            onClick={handleClose}
                            type="button"
                            variant="secondary"
                            className="hover:bg-secondary-hover"
                        >
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MemoWritePageLayout__CreateMemoDetailInfoModal;