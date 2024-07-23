'use client'

import {useContext} from "react";
import {MemoContext} from "@/context/MemoContext";
import MyMemoContextMenuModal from "@/components/page_components/myMemo/layout/MyMemoContextMenuModal";

interface SecurityListProps {
    isTab: string;
}

const MySecurityMemos = ({isTab}: SecurityListProps) => {

    const {findAllMyMemo} = useContext(MemoContext);
    const securityMemos = findAllMyMemo?.data?.filter(memo => memo.security);

    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab4" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-gray-100 dark:bg-black dark:bg-opacity-40 space-y-4 flex-1 p-1">

                <div
                    className={`flex flex-col space-y-1`}
                    id="tab4">
                    {securityMemos?.map((securityMemo) => {
                        return <MyMemoContextMenuModal key={securityMemo.id} memo={securityMemo}/>
                    })}
                </div>

            </div>
        </div>
    )
}

export default MySecurityMemos