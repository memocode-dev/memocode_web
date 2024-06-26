import {createContext, ReactNode} from "react";
import {useParams} from "react-router-dom";
import {type QueryKey, type UseQueryResult} from "@tanstack/react-query";
import {ErrorType} from "@/axios/axios_instance.ts";
import {FindAllMyMemoMemoResult, FindAllMyMemoVersionMemoVersionResult, FindMyMemoMemoResult,} from "@/openapi/model";
import {useFindAllMyMemo, useFindMyMemo} from "@/openapi/api/users-memos/users-memos.ts";
import {useFindAllMyMemoVersion} from "@/openapi/api/users-memoversions/users-memoversions.ts";

export const MemoContext = createContext<{
    findAllMyMemo: UseQueryResult<FindAllMyMemoMemoResult[], ErrorType<unknown>> & { queryKey: QueryKey },
    findMyMemo: UseQueryResult<FindMyMemoMemoResult, ErrorType<unknown>> & { queryKey: QueryKey },
    memoId: string | undefined,
    findAllMyMemoVersion: UseQueryResult<FindAllMyMemoVersionMemoVersionResult[], ErrorType<unknown>> & {
        queryKey: QueryKey
    },
}>(undefined!);

export const MemoProvider = ({children}: { children: ReactNode }) => {

    const {memoId} = useParams();

    const findAllMyMemo = useFindAllMyMemo({
        query: {
            queryKey: ["my-memos"]
        }
    });

    const findMyMemo =
        useFindMyMemo(
            memoId!, {
                query: {
                    queryKey: ["MemoEdit", memoId!]
                }
            })

    const findAllMyMemoVersion = useFindAllMyMemoVersion(
        memoId!,
        {
            query: {
                queryKey: ["memoVersions", memoId]
            }
        })

    const value = {
        findAllMyMemo,
        findMyMemo,
        memoId,
        findAllMyMemoVersion,
    }

    return <MemoContext.Provider value={value}>{children}</MemoContext.Provider>;
}