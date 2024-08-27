'use client'

import {useContext, useEffect} from "react";
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
import {useCreateMemo} from "@/openapi/api/memos/memos";
import {useForm} from "react-hook-form";
import {CreateMemoForm} from "@/openapi/model";
import {useRouter} from "next/navigation";
import {useTheme} from "@/context/ThemeContext";
import MyMemoUpdateDetailInfoForm from "@/components/page_components/myMemo/toolbar/MyMemoUpdateDetailInfoForm";
import MyMemoCreateDetailInfoForm from "@/components/page_components/myMemo/toolbar/MyMemoCreateDetailInfoForm";

const MyMemoCreateDetailInfoModal = () => {

    const {modalState, closeModal} = useContext(ModalContext);
    const router = useRouter()
    const {theme} = useTheme()

    const {
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
                    className: "text-sm",
                });
                await findAllMyMemo.refetch();
                typeof window !== 'undefined' && router.push(`/w/${memo_id}`);
                closeModal({name: ModalTypes.MY_MEMO_CREATE_DETAIL_INFO})
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

    const handleSave = () => {
        createMemo({
            data: createMemoForm.getValues(),
        });
    }

    const handleClose = () => {
        closeModal({name: ModalTypes.MY_MEMO_CREATE_DETAIL_INFO})
    }

    useEffect(() => {
        if (!modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO].isVisible) {
            createMemoForm.reset();
        }
    }, [modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO]]);

    return (
        <Dialog open={modalState[ModalTypes.MY_MEMO_CREATE_DETAIL_INFO].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 h-[90vh] overflow-y-auto outline-0">
                <DialogHeader>
                    <DialogTitle>메모 등록하기</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-300">
                        메모의 상세정보를 작성해보세요! 블로그에 게시되면 다른 사람들도 볼 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <MyMemoCreateDetailInfoForm form={createMemoForm}/>

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

export default MyMemoCreateDetailInfoModal;