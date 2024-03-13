import React, {useEffect, useState} from "react";
import {useDeleteMemo} from "@/openapi/memo/api/memos/memos.ts";
import {toast} from "react-toastify";

interface MemoContextMenuWrapperProperties {
    memoId?: string;
    children: React.ReactNode;
    className?: string;
    onMemoDeleteSuccess: () => void;
}

// 오른쪽 버튼을 눌렀을 때 메모의 상태를 관리할 수 있는 메뉴
const MemoContextMenuWrapper = ({children, memoId, className, onMemoDeleteSuccess}: MemoContextMenuWrapperProperties) => {
    const [contextMenu, setContextMenu] =
        useState({show: false, position: {x: 0, y: 0}});
    const [showRemoveModal, setShowRemoveModal] = useState<boolean>(false);
    const [newMemoId, setNewMemoId] = useState("")

    const onDeleteSubmit = () => deleteMemo({memoId: newMemoId})

    const {mutate: deleteMemo} = useDeleteMemo({
        mutation: {
            onSuccess: () => {
                toast.success("메모가 삭제되었습니다.");
                onMemoDeleteSuccess();
            },
            onError: (error, variables, context) => {
                console.log(error)
                console.log(variables)
                console.log(context)
                toast.error("관리자에게 문의하세요");
            }
        }
    })

    const handleContextMenu = (event: any) => {
        event.preventDefault();
        setContextMenu({
            show: true,
            position: {x: event.clientX, y: event.clientY}
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({show: false, position: {x: 0, y: 0}});
    };

    const handleRemove = async () => {
        onDeleteSubmit()
        handleCloseContextMenu();
    };

    useEffect(() => {
        if (memoId !== undefined) {
            setNewMemoId(memoId)
        } else {
            setNewMemoId("")
        }
    }, [memoId]);

    return (
        <div onContextMenu={handleContextMenu} className={className}>
            {children}
            {contextMenu.show && <div
                className="absolute bg-gray-50 shadow rounded w-[130px] p-1 z-[10000]"
                style={{
                    top: contextMenu.position.y,
                    left: contextMenu.position.x,
                }}
                onMouseLeave={handleCloseContextMenu}
            >
                <button className="w-full p-1 rounded hover:bg-gray-200 hover:bg-opacity-70 flex items-center"
                        onClick={() => setShowRemoveModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
                         className="-mt-[2px] ml-1 mr-2">
                        <path
                            d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                    <span className="text-sm">삭제</span>
                </button>
                <div
                    className={`fixed z-[3000] top-0 right-0 left-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center ${showRemoveModal ? '' : 'hidden'}`}
                    onClick={() => {
                        setShowRemoveModal(false);
                    }}>
                    <div
                        className="bg-white dark:bg-neutral-800 rounded-xl flex flex-col py-8 px-8 justify-between space-y-10"
                        onClick={(event) => event.stopPropagation()}>
                        <div className="text-lg">
                            <span>메모를 삭제하시겠습니까?</span>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button className="btn" onClick={handleRemove}>확인</button>
                            <button className="btn" onClick={() => {
                                setShowRemoveModal(false);
                            }}>취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default MemoContextMenuWrapper;