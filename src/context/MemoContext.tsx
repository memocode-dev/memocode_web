'use client'

import {createContext, ReactNode} from "react";
import {type QueryKey, type UseQueryResult} from "@tanstack/react-query";
import {FindAllMyMemoMemoResult, FindAllMyMemoVersionMemoVersionResult, FindMyMemoMemoResult,} from "@/openapi/model";
import {ErrorType} from "@/axios/axios_instance";
import {useParams} from "next/navigation";
import {useFindAllMyMemo, useFindMyMemo} from "@/openapi/api/users-memos/users-memos";
import {useFindAllMyMemoVersion} from "@/openapi/api/users-memoversions/users-memoversions";

export const MemoContext = createContext<{
    findAllMyMemo: UseQueryResult<FindAllMyMemoMemoResult[], ErrorType<unknown>> & { queryKey: QueryKey },
    findMyMemo: UseQueryResult<FindMyMemoMemoResult, ErrorType<unknown>> & { queryKey: QueryKey },
    memoId: string | undefined,
    findAllMyMemoVersion: UseQueryResult<FindAllMyMemoVersionMemoVersionResult[], ErrorType<unknown>> & {
        queryKey: QueryKey
    },
}>(undefined!);

export const MemoProvider = ({children}: { children: ReactNode }) => {

    const params = useParams<{ memoId: string }>();
    const memoId = params?.memoId || '';

    const findAllMyMemo = useFindAllMyMemo({
        query: {
            queryKey: ["MyMemos"]
        }
    });

    const findMyMemo =
        useFindMyMemo(
            memoId!, {
                query: {
                    queryKey: ["MyMemo", memoId!]
                }
            })

    const findAllMyMemoVersion = useFindAllMyMemoVersion(
        memoId!,
        {
            query: {
                queryKey: ["MyMemoVersions", memoId]
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