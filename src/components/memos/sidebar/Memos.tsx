import {useCreateMemo, useFindAllMemo} from "@/openapi/memo/api/memos/memos.ts";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {MemoCreateForm} from "@/openapi/memo/model";
import MemoContextMenuWrapper from "@/components/memos/context_menu/MemoContextMenuWrapper.tsx";
interface totalListProps {
    isTab: string;
}

const Memos = ({isTab}: totalListProps) => {
    const navigate = useNavigate()

    const {data: lists, refetch} =
        useFindAllMemo({
            query: {
                queryKey: ["memos"]
            }
        })

    const onSubmit = (data: MemoCreateForm) => createMemo({data: data})

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

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab1" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-white dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 p-1">
                <div
                    className={`flex flex-col`}
                    id="tab1">

                    {lists ?
                        lists?.data?.map((memo) => (
                            <MemoContextMenuWrapper
                                onMemoDeleteSuccess={refetch}
                                memoId={memo?.id}
                                key={memo?.id}
                            >
                                <Link
                                    className="flex text-gray-900 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-black rounded-sm py-1 px-2 cursor-pointer"
                                    to={`/w/${memo.id}`}
                                    key={memo.id}
                                >
                                    <span className="text-sm tracking-wider">{memo.title || "(제목 없는 데이터)"}</span>
                                </Link>
                            </MemoContextMenuWrapper>
                        ))
                        :
                        <button
                            onClick={() => onSubmit({
                                title: "제목없음",
                                content: "내용없음"
                            })}
                            className="mx-2 my-1 hover:bg-gray-100 pl-1 py-2"
                        >
                            새 메모 시작하기
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Memos