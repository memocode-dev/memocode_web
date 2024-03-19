import {createContext, ReactNode} from "react";
import {useCreateMemo, useFindAllMemo, useFindMemo, useUpdateMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {type QueryKey, UseMutateFunction, type UseQueryResult} from "@tanstack/react-query";
import {ErrorType} from "@/axios/dev_axios_instance.ts";
import {MemoCreateForm, MemoDetailDTO, MemosDTO, MemoUpdateForm, MemoVersionsDTO} from "@/openapi/memo/model";
import {useForm, UseFormReturn} from "react-hook-form";
import {useFindAllMemoVersion} from "@/openapi/memo/api/memo-version/memo-version.ts";

export const MemoContext = createContext<{
    createMemo: UseMutateFunction<string, ErrorType<unknown>, {
        data: MemoCreateForm,
    }, unknown>,
    findAllMemo: UseQueryResult<MemosDTO, ErrorType<unknown>> & { queryKey: QueryKey },
    updateMemo: UseMutateFunction<void, ErrorType<unknown>, {
        memoId: string,
        data: MemoUpdateForm,
    }, unknown>,
    onMemoCreateSubmit: () => void,
    findMemo: UseQueryResult<MemoDetailDTO, ErrorType<unknown>> & { queryKey: QueryKey },
    memoId: string | undefined,
    memoForm: UseFormReturn<MemoCreateForm, unknown, MemoCreateForm>,
    onMemoUpdateSubmit: () => void,
    findAllMemoVersion: UseQueryResult<MemoVersionsDTO, ErrorType<unknown>> & { queryKey: QueryKey },
}>(undefined!);

export const MemoProvider = ({children}: { children: ReactNode }) => {

    const navigate = useNavigate();
    const {memoId} = useParams();

    const findAllMemo = useFindAllMemo({
        query: {
            queryKey: ["memos"]
        }
    });

    const {mutate: createMemo} = useCreateMemo({
        mutation: {
            onSuccess: async (memoId) => {
                toast.success("성공적으로 메모가 생성되었습니다.")
                await findAllMemo.refetch();
                navigate(`/w/${memoId}`);
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const {mutate: updateMemo} = useUpdateMemo({
        mutation: {
            onSuccess: async () => {
                toast.success("성공적으로 메모가 수정되었습니다.")
                await findAllMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요.")
            },
        }
    })

    /* 메모 단건 조회 */
    const findMemo =
        useFindMemo(
            memoId!, {
                query: {
                    queryKey: ["MemoEdit", memoId!]
                }
            })

    const memoForm = useForm<MemoCreateForm>({
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const onMemoCreateSubmit = () => createMemo({
        data: {
            title: "",
            content: "",
        }
    })

    const onMemoUpdateSubmit = () => updateMemo({
        memoId: memoId!,
        data: memoForm.watch(),
    })

    const findAllMemoVersion = useFindAllMemoVersion(
        memoId!,
        {
            query: {
                queryKey: ["memoVersions", memoId]
            }
        })

    const value = {
        createMemo,
        findAllMemo,
        updateMemo,
        onMemoCreateSubmit,
        findMemo,
        memoId,
        memoForm,
        onMemoUpdateSubmit,
        findAllMemoVersion,
    }

    return <MemoContext.Provider value={value}>{children}</MemoContext.Provider>;
}