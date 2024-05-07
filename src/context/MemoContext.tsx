import {createContext, ReactNode} from "react";
import {toast} from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import {type QueryKey, UseMutateFunction, type UseQueryResult} from "@tanstack/react-query";
import {ErrorType} from "@/axios/axios_instance.ts";
import {useForm, UseFormReturn} from "react-hook-form";
import {
    CreateMemoForm,
    FindAllMyMemoMemoResult,
    FindAllMyMemoVersionMemoVersionResult,
    FindMyMemoMemoResult,
    UpdateMemoForm
} from "@/openapi/model";
import {useFindAllMyMemo, useFindMyMemo} from "@/openapi/api/users-memos/users-memos.ts";
import {useCreateMemo, useUpdateMemo} from "@/openapi/api/memos/memos.ts";
import {useFindAllMyMemoVersion} from "@/openapi/api/users-memoversions/users-memoversions.ts";

export const MemoContext = createContext<{
    createMemo: UseMutateFunction<string, ErrorType<unknown>, {
        data: CreateMemoForm,
    }, unknown>,
    findAllMyMemo: UseQueryResult<FindAllMyMemoMemoResult[], ErrorType<unknown>> & { queryKey: QueryKey },
    updateMemo: UseMutateFunction<void, ErrorType<unknown>, {
        memoId: string,
        data: UpdateMemoForm,
    }, unknown>,
    onMemoCreateSubmit: () => void,
    findMyMemo: UseQueryResult<FindMyMemoMemoResult, ErrorType<unknown>> & { queryKey: QueryKey },
    memoId: string | undefined,
    updateMemoForm: UseFormReturn<UpdateMemoForm, unknown, UpdateMemoForm>,
    writeMemoForm: UseFormReturn<CreateMemoForm, unknown, CreateMemoForm>,
    onMemoUpdateSubmit: () => void,
    findAllMyMemoVersion: UseQueryResult<FindAllMyMemoVersionMemoVersionResult[], ErrorType<unknown>> & {
        queryKey: QueryKey
    },
}>(undefined!);

export const MemoProvider = ({children}: { children: ReactNode }) => {

    const navigate = useNavigate();
    const {memoId} = useParams();

    const findAllMyMemo = useFindAllMyMemo({
        query: {
            queryKey: ["my-memos"]
        }
    });

    const {mutate: createMemo} = useCreateMemo({
        mutation: {
            onSuccess: async (memoId) => {
                toast.success("성공적으로 메모가 생성되었습니다.")
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
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
                await findMyMemo.refetch();
                await findAllMyMemo.refetch();
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요.")
            },
        }
    })

    const findMyMemo =
        useFindMyMemo(
            memoId!, {
                query: {
                    queryKey: ["MemoEdit", memoId!]
                }
            })

    const updateMemoForm = useForm<UpdateMemoForm>({
        defaultValues: {
            title: "",
            content: "",
            summary: "",
            security: false,
        },
    });

    const writeMemoForm = useForm<CreateMemoForm>({
        defaultValues: {
            title: "",
            content: "",
            summary: "",
            security: false,
        },
    });

    const onMemoCreateSubmit = () => createMemo({
        data: writeMemoForm.watch()
    })

    const onMemoUpdateSubmit = () => updateMemo({
        memoId: memoId!,
        data: updateMemoForm.watch(),
    })

    const findAllMyMemoVersion = useFindAllMyMemoVersion(
        memoId!,
        {
            query: {
                queryKey: ["memoVersions", memoId]
            }
        })

    const value = {
        createMemo,
        findAllMyMemo,
        updateMemo,
        onMemoCreateSubmit,
        findMyMemo,
        memoId,
        updateMemoForm,
        writeMemoForm,
        onMemoUpdateSubmit,
        findAllMyMemoVersion,
    }

    return <MemoContext.Provider value={value}>{children}</MemoContext.Provider>;
}