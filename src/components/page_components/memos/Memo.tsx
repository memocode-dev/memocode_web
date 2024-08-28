'use client';

import Avatar from "react-avatar";
import {SearchMemoMemoResult} from "@/openapi/model";
import timeSince from "@/components/utils/timeSince";
import {useRouter} from "next/navigation";
import {Skeleton} from "@/components/ui/skeleton";

interface MemoProps {
    memo: SearchMemoMemoResult;
    isLoading: boolean;
}

const Memo = ({memo, isLoading}: MemoProps) => {

    const router = useRouter();

    return (
        <>
            {isLoading &&
                Array.from({length: 12}, (_, index) => (
                    <Skeleton key={index} className="bg-secondary"/>
                ))
            }

            <div key={memo.id}
                 className={`flex flex-col border border-secondary dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg`}
                 onClick={() => {
                     typeof window !== 'undefined' && router.push(`/@${memo?.user?.username}/memos/${memo.id}`)
                 }}
                 style={{aspectRatio: '3 / 4'}}
            >

                <div className="w-full h-[60%]">
                    {memo.thumbnailUrl ?
                        <img src={memo.thumbnailUrl} alt={memo.id + `_thumbnail`}
                             className="w-full h-full rounded-t-lg"/>
                        :
                        <div
                            className="flex items-center justify-center bg-neutral-200/50 dark:bg-neutral-700 w-full h-full rounded-t-lg">
                            <div className="logo-font text-2xl text-gray-400 dark:text-neutral-400">MEMOCODE</div>
                        </div>
                    }
                </div>

                <div
                    className={`flex-1 flex flex-col justify-between p-4`}>
                    <div>
                        <div
                            className="text-lg font-semibold tracking-tight line-clamp-2 leading-5">{memo.title}</div>
                        <div
                            className="text-md mt-2 tracking-tight line-clamp-2 text-gray-600 dark:text-gray-400 leading-5">
                            {memo.summary}
                        </div>
                    </div>

                    {/*<div className="mt-3">*/}
                    <div className="flex items-center text-xs">
                        <div className="flex items-center space-x-1.5">
                            <Avatar
                                name={memo.user?.username}
                                size="25"
                                round="3px"/>

                            <div>{memo.user?.username}</div>

                            <div
                                className="text-gray-500 dark:text-gray-400">{timeSince(new Date(memo.createdAt!))}</div>
                        </div>
                    </div>

                    {/*<div className="flex justify-between text-xs mt-1">*/}
                    {/*    <div className="flex space-x-2">*/}
                    {/*        <div className="flex items-center space-x-1">*/}
                    {/*            <AiFillLike className="w-4 h-4"/>*/}
                    {/*            <div>미</div>*/}
                    {/*        </div>*/}

                    {/*        <div className="flex items-center space-x-1">*/}
                    {/*            <IoGlasses className="w-6 h-6"/>*/}
                    {/*            <div>구</div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    <div className="flex items-center space-x-1">*/}
                    {/*        <AiOutlineComment className="w-5 h-5"/>*/}
                    {/*        <div>현</div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </>
    );
}

export default Memo;