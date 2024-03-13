import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";

interface toolBarMemoVersionProps {
    sidebarOpen: boolean;
    sidebarWidth: number;
}

const ToolBarMemoVersion = ({sidebarOpen, sidebarWidth}: toolBarMemoVersionProps) => {

    // const [showMemoVersion, setShowMemoVersion] = useState(false);
    // const [showMemoVersionDetails, setShowMemoVersionDetails] = useState(false);
    // const [memoVersionTitle, setMemoVersionTitle] = useState("");
    // const [memoVersionContent, setMemoVersionContent] = useState("");

    // const showMemoVersionDetailsButtonHandler = async (versionId: string) => {
    //     const memoVersion = await fetchMemoVersionById(versionId);
    //     setMemoVersionTitle(memoVersion.title);
    //     setMemoVersionContent(memoVersion.content);
    //     setShowMemoVersionDetails(prev => !prev);
    // }

    return (
        <Dialog>
            <DialogTrigger asChild style={{marginLeft: `${sidebarOpen ? sidebarWidth : 0}px`}}
                           className="fixed z-[80] top-2.5 left-10">
                <div
                    className="bg-transparent hover:bg-gray-200 dark:hover:bg-black hover:rounded-sm p-1.5">
                    <div className="cursor-pointer">
                        <svg className="dark:fill-gray-300" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                            <path
                                d="M24 56c0-13.3 10.7-24 24-24H80c13.3 0 24 10.7 24 24V176h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H40c-13.3 0-24-10.7-24-24s10.7-24 24-24H56V80H48C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432H120c13.3 0 24 10.7 24 24s-10.7 24-24 24H32c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
                        </svg>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent
                className="flex flex-col max-w-[250px] h-[500px] sm:max-w-[620px] lg:max-w-[825px] rounded-lg z-50">
                <DialogHeader className="flex">
                    <DialogTitle>메모 버전 관리</DialogTitle>
                    <DialogDescription className="flex flex-col lg:flex-row lg:space-x-1 text-gray-400">
                        <div>중요한 메모에 버전을 설정하여 <span className="text-blue-500">안전</span>하게 관리해보세요!</div>
                        <div>내용이 <span className="text-red-400">변경</span> 또는 <span className="text-red-400">유실</span>되어도
                            복원이 가능합니다.
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center py-5">
                    <Button
                        className="w-full sm:w-[50%] bg-indigo-400 hover:bg-indigo-500">
                        메모 버전 추가
                    </Button>
                </div>

                <div className="overflow-x-auto py-2 sm:px-10">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>버전</TableHead>
                                <TableHead className="hidden sm:flex">생성날짜</TableHead>
                                <TableHead>보기</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">v1</TableCell>
                                <TableCell className="hidden sm:flex">2024.03.06</TableCell>
                                <TableCell>
                                    <Button
                                        className="w-20 h-7 bg-indigo-400 hover:bg-indigo-500">
                                        내용보기
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">v2</TableCell>
                                <TableCell className="hidden sm:flex">2024.03.06</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">v3</TableCell>
                                <TableCell className="hidden sm:flex">2024.03.06</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">v4</TableCell>
                                <TableCell className="hidden sm:flex">2024.03.06</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="flex flex-1 items-end">
                    <DialogClose asChild className="hidden sm:flex">
                        <Button type="button" variant="secondary">
                            닫기
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        //     <div
        //         className={`scroll-y-auto fixed z-[4000] top-0 right-0 left-0 bottom-0 flex justify-center items-center ${showMemoVersionDetails ? '' : 'hidden'}`}
        //         onClick={() => {
        //             setShowMemoVersion(prev => !prev)
        //             setShowMemoVersionDetails(false)
        //         }}>
        //         <div className="w-[80%] h-[80%] bg-white dark:bg-neutral-800 flex flex-col relative overflow-y-auto"
        //              onClick={(event) => event.stopPropagation()}>
        //             <div>
        //                 <button
        //                     onClick={() => setShowMemoVersionDetails(prev => !prev)}
        //                     className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕
        //                 </button>
        //             </div>
        //             <div className="flex px-8 py-4 mt-8">
        //                 <span className="text-2xl">{memoVersionTitle}</span>
        //             </div>
        //             <div className="flex justify-center px-4 flex-col">
        //                 {/*<MemoContentTiptapViewer content={memoVersionContent}/>*/}
        //             </div>
        //         </div>
        //     </div>
        // </>
    )
}

export default ToolBarMemoVersion