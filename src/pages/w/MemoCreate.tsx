import {Button} from "@/components/ui/button.tsx";
import {useCreateMemo, useFindAllMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";
import {MemoCreateForm} from "@/openapi/memo/model";
import {useNavigate} from "react-router-dom";

const MemoCreate = () => {

    const navigate = useNavigate()
    const {refetch} =
        useFindAllMemo({
            query: {
                queryKey: ["memos"]
            }
        })

    const {mutate: createMemo} = useCreateMemo({
        mutation: {
            onSuccess: (memoId) => {
                navigate(`/w/${memoId}`)
                toast.success("성공적으로 메모가 생성되었습니다.")
                refetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const onSubmit = (data: MemoCreateForm) => createMemo({data: data})

    return (
        <div className="flex-1 flex justify-center items-center bg-white dark:bg-[#1E1E1E]">
            <Button
                className="px-10 py-7 bg-indigo-400 dark:bg-indigo-700 dark:hover:bg-indigo-800 hover:bg-indigo-500 hover:scale-110 transform transition duration-300 rounded-lg shadow"
                onClick={() => onSubmit({
                    title: "제목없음",
                    content: "내용없음"
                })}
            >
                <div className="text-white text-[16px]">새 메모 시작하기</div>
            </Button>
        </div>
    )
}

export default MemoCreate;