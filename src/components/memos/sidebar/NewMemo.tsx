import {useNavigate} from "react-router-dom";
import {useCreateMemo, useFindAllMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";
import {MemoCreateForm} from "@/openapi/memo/model";

const NewMemo = () => {

    const navigate = useNavigate()
    const {refetch} =
        useFindAllMemo({
            page: 1,
            size: 5,
        }, {
            query: {
                queryKey: ["TotalList"]
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
        <div
            className="select-none cursor-pointer"
            onClick={() => onSubmit({
                title: "제목없음",
                content: "내용없음"
            })}
        >
            <div
                className="bg-transparent hover:bg-gray-200 dark:hover:bg-black rounded-sm py-1 px-2">
                <div className="text-sm cursor-pointer tracking-wider">새 메모</div>
            </div>
        </div>
    )
}

export default NewMemo