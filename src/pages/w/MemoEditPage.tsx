import ToolBarMemoVersion from "@/components/memos/toolbar/ToolBarMemoVersion.tsx";
import MonacoEditor from "@/components/common/MonacoEditor.tsx";
import React, {useState} from "react";
import {useForm} from "react-hook-form";

const MemoEditPage = () => {

    const sidebarWidth = 300;
    const memoId = "4bfdbfb3-1e67-4995-af44-9184e9cfcf85";
    const [content, setContent] = useState("")
    const [tempTitle, setTempTitle] = useState("")

    const {
        setValue
    } = useForm({
        defaultValues: {
            saveTitle: ""
        },
    });

    const setTitleHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTempTitle(e.target.value);
        debouncedSetSaveTitle(e.target.value);
    }

    const debouncedSetSaveTitle = (title: string) => {
        setValue("saveTitle", title)
    }

    // 이미지 업로드 함수
    //codeMirror Editor에 content 추가
    // const codeMirrorAddContentHandler = useCallback((text: string) => {
    //     const codeMirror = codeMirrorRef.current;
    //     if (codeMirror) {
    //         codeMirror.view?.dispatch(
    //             codeMirror.view?.state.changeByRange((range) => ({
    //                 changes: [{from: range.to, insert: text}],
    //                 range: EditorSelection.range(
    //                     range.to + text.length,
    //                     range.to + text.length
    //                 ),
    //             }))
    //         );
    //         codeMirror.editor?.focus();
    //     }
    // }, [codeMirrorRef]);

    return (
        <>{memoId && <>
            <div className="flex-1 flex flex-col pt-14 overflow-y-auto bg-white dark:bg-[#1E1E1E]">

                {/* title */}
                <div className="my-2 p-2 w-full max-w-[968px] bg-[#fdfdfd] dark:bg-[#1E1E1E] mx-auto">
                   <textarea
                       value={tempTitle}
                       className="text-2xl bg-[#fdfdfd] dark:bg-[#1E1E1E] placeholder-gray-300 focus:outline-none"
                       placeholder="제목 없음"
                       onChange={setTitleHandler}
                       style={{
                           width: '100%',
                           overflow: 'hidden',
                           resize: 'none',
                       }}
                   />
                </div>

                {/* content */}
                <div className="flex-1 flex mx-auto w-full max-w-[968px] bg-[#fdfdfd] mb-24 flex-col">
                    <MonacoEditor language="markdown" theme="vs" onChange={(value) => setContent(value)}
                                  value={content}/>
                </div>
            </div>


            {/* 미리보기 버튼 */}
            {/*<ToolBarPreview isPreview={isPreview} setIsPreview={setIsPreview} sidebarWidth={sidebarWidth}/>*/}

            {/* 메모 버전 생성 및 리스트 버튼 */}
            <ToolBarMemoVersion sidebarOpen={true} sidebarWidth={sidebarWidth}/>

            {/* 이미지 업로드 버튼 */}
            {/*<div*/}
            {/*    style={{marginLeft: `${sidebarWidth}px`}}*/}
            {/*    className="fixed left-0 top-2 flex items-center space-x-2 z-[60]">*/}
            {/*    <div className="ml-40">*/}
            {/*        <MemoToolBarMenu handler={codeMirrorAddContentHandler} memoId={memoId}/>*/}
            {/*    </div>*/}
            {/*</div>*/}

        </>}</>
    );

}

export default MemoEditPage;