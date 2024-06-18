import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {Bounce, toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {useDeleteQuestion} from "@/openapi/api/questions/questions.ts";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const QuestionPage__QuestionDeleteModal = () => {

    const {questionId} = useParams()
    const {modalState, closeModal} = useContext(ModalContext)
    const navigate = useNavigate()
    const {theme} = useContext(ThemeContext)

    const {mutate: deleteQuestion} = useDeleteQuestion({
        mutation: {
            onSuccess: async () => {
                closeModal({name: ModalTypes.QUESTION_DELETE})
                toast.success("성공적으로 질문이 삭제되었습니다.", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
                navigate("/questions")
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요", {
                    position: "bottom-right",
                    theme: theme,
                    transition: Bounce,
                });
            },
        }
    })

    const onDeleteSubmit = () => deleteQuestion({
        questionId: questionId!,
    })

    return (
        <Dialog open={modalState[ModalTypes.QUESTION_DELETE].isVisible}>
            <DialogContent
                className="flex flex-col min-w-[250px] lg:min-w-[350px] rounded-lg z-50 dark:bg-neutral-700 outline-0 px-3 py-5 sm:p-5">
                <DialogHeader className="flex justify-center items-center">
                    <DialogTitle>삭제</DialogTitle>
                    <div className="flex flex-col py-5 items-center">
                        <span>질문을 삭제하시겠습니까?</span>
                    </div>
                </DialogHeader>
                <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                    <Button
                        className="w-auto"
                        onClick={onDeleteSubmit}
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
                                    name: ModalTypes.QUESTION_DELETE
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

export default QuestionPage__QuestionDeleteModal