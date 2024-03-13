import {useNavigate} from "react-router-dom";
import {useCreateMemo, useFindAllMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";
import {MemoCreateForm} from "@/openapi/memo/model";

const MemoCreateButton = () => {

    const navigate = useNavigate()
    const {refetch} = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    })

    const {mutate: createMemo} = useCreateMemo({
        mutation: {
            onSuccess: async (memoId) => {
                toast.success("성공적으로 메모가 생성되었습니다.")
                await refetch();
                navigate(`/w/${memoId}`)
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
                title: "test",
                content: "test"
            })}
        >
            <div
                className="bg-transparent hover:bg-gray-200 dark:hover:bg-black rounded-sm py-1 px-2">
                <div className="text-sm cursor-pointer tracking-wider">새 메모</div>
            </div>
        </div>
    )
}

export default MemoCreateButton;