import {useContext, useEffect, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {MemoContext} from "@/context/MemoContext";
import {Bounce, toast} from "react-toastify";
import {useUpdateMemo} from "@/openapi/api/memos/memos";
import {useForm} from "react-hook-form";
import {UpdateMemoForm} from "@/openapi/model";
import LoadingPage from "@/pages/loading/LoadingPage";
import {useTheme} from "@/context/ThemeContext";
import MyMemoCreateDetailInfoForm from "@/page_components/myMemo/toolbar/MyMemoCreateDetailInfoForm";

const MyMemoUpdateDetailInfoModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const [memoId, setMemoId] = useState("");
    const {theme} = useTheme()

    const {
        findMyMemo,
        findAllMyMemo,
    } = useContext(MemoContext);

    const updateMemoForm = useForm<UpdateMemoForm>({
        defaultValues: {},
    });

    const {mutate: UpdateRepresentativeMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모가 수정되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
                closeModal({name: ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO})
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                    className: "text-sm",
                });
            },
        }
    })

    const handleRepresentativeMemo = () => {
        UpdateRepresentativeMemo({
            memoId: memoId!,
            data: updateMemoForm.getValues(),
        });
    }

    const handleCloseRepresentativeMemo = () => {
        updateMemoForm.reset();
        closeModal({name: ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO})
    }

    useEffect(() => {
        if (findMyMemo.data) {
            setMemoId(findMyMemo.data.id!);
            updateMemoForm.reset({
                title: findMyMemo.data.title,
                summary: findMyMemo.data.summary,
                tags: findMyMemo.data.tags,
            });
        }

    }, [findMyMemo.data]);

    if (!memoId) {
        return <LoadingPage/>;
    }

    return (
        <Dialog open={modalState[ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 h-[90vh] overflow-y-auto outline-0">
                <DialogHeader>
                    <DialogTitle>메모 상세정보 수정하기</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-300">
                        메모의 상세정보를 수정해보세요! 블로그에 게시되면 다른 사람들도 볼 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <MyMemoCreateDetailInfoForm form={updateMemoForm}/>

                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <DialogClose asChild>
                        <Button
                            className="w-auto"
                            type="submit"
                            onClick={handleRepresentativeMemo}
                        >
                            저장
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            onClick={handleCloseRepresentativeMemo}
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

export default MyMemoUpdateDetailInfoModal;