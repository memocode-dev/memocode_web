import {useContext, useState} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {faker} from "@faker-js/faker";
import {RiAddLine, RiArticleFill, RiDraggable} from "react-icons/ri";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import MemoSeriesManagementPage__MemoSeriesAddModal
    from "@/page_components/memo_series_management_page/MemoSeriesManagementPage__MemoSeriesAddModal.tsx";

const MemoSeriesManagementPage__MemoSeriesModal = () => {

    const {modalState, openModal, closeModal} = useContext(ModalContext)
    const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null); // 호버된 행 인덱스 상태

    // 가짜 데이터 생성 및 상태 관리, 드롭 상태 추가
    const generateData = (numItems: number) => Array.from({length: numItems}, () => {
        return {
            title: faker.lorem.sentence(),
            updatedAt: faker.date.past(2),
        };
    });

    const [fakeDatas, setFakeDatas] = useState(generateData(20));

    const onDragEnd = (result: DropResult): void => {
        const {source, destination} = result;

        // 드롭되지 않은 항목은 무시
        if (!destination) {
            return;
        }

        // 배열의 순서를 재정렬
        const reorderedItems = Array.from(fakeDatas);
        const [reorderedItem] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, reorderedItem);

        // 상태 업데이트
        setFakeDatas(reorderedItems);
    };

    const handleDeleteSeriesPost = () => {
        console.log("삭제")
    }

    return (
        <>
            <Dialog open={modalState[ModalTypes.MEMO_SERIES].isVisible}>
                <DialogContent
                    className="flex flex-col min-w-[90%] lg:min-w-[70%] rounded-lg z-50 h-[90vh] outline-0 overflow-y-auto px-3 py-5 sm:p-5">
                    <DialogHeader className="flex">
                        <DialogTitle>시리즈 수정</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-300">
                            포스트의 순서를 정하거나, 추가 또는 삭제할 수 있습니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 bg-transparent mt-5">
                        <div className="flex space-x-1 px-5">
                            <RiArticleFill className="w-5 h-5"/>
                            <span className="text-sm font-semibold">{fakeDatas.length}개의 포스트</span>
                        </div>

                        {/* 드래그앤드롭으로 시리즈 순서 재정렬 */}
                        <Table>
                            <TableHeader className="flex flex-1 px-5">
                                <TableRow className="flex flex-1 border-b border-b-gray-200 dark:border-b-neutral-600">
                                    <TableHead className="flex justify-center items-center w-[30px]">번호</TableHead>
                                    <TableHead className="flex justify-center items-center flex-1">포스트 제목</TableHead>
                                    <TableHead
                                        className="hidden sm:flex justify-center items-center w-[100px]">업데이트</TableHead>
                                    <TableHead className="flex justify-center items-center w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>

                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId="droppableTable">
                                    {(provided) => (

                                        <TableBody
                                            {...provided.droppableProps} ref={provided.innerRef}
                                            className="flex flex-col h-[400px] overflow-y-auto px-5">

                                            {fakeDatas && fakeDatas.map((fakeData, index) => (
                                                <Draggable key={index} draggableId={String(index + 1)} index={index}>
                                                    {(provided, snapshot) => (
                                                        <TableRow
                                                            key={index}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`flex flex-1 items-center border-b border-b-gray-200 dark:border-b-neutral-600
                                                         ${snapshot.isDragging ? 'bg-blue-50 dark:bg-blue-500 cursor-grabbing' : 'hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-grab'}
                                                        `}
                                                            onMouseOver={() => setHoveredRowIndex(index)}
                                                            onMouseLeave={() => setHoveredRowIndex(null)}
                                                        >

                                                            <TableCell
                                                                className="flex justify-center items-center w-[30px] py-2 relative">
                                                                <RiDraggable
                                                                    className={`absolute -left-7 w-7 h-7 ${hoveredRowIndex === index ? `text-gray-400` : `text-transparent`}`}/>

                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell className="flex-1 p-2">
                                                                {fakeData.title}
                                                            </TableCell>
                                                            <TableCell
                                                                className="hidden sm:flex flex-col text-center w-[100px] py-2">
                                                            <span>
                                                                {fakeData?.updatedAt
                                                                    ? new Date(fakeData?.updatedAt).toLocaleDateString('en-CA', {
                                                                        year: 'numeric',
                                                                        month: '2-digit',
                                                                        day: '2-digit'
                                                                    }).replace(/-/g, '.')
                                                                    : ''}
                                                            </span>
                                                            </TableCell>
                                                            <TableCell className="text-center w-[80px] py-2">
                                                                <Button
                                                                    variant="destructive"
                                                                    className="w-fit h-7"
                                                                    onClick={handleDeleteSeriesPost}
                                                                >
                                                                    삭제
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>

                                                    )}
                                                </Draggable>
                                            ))}

                                        </TableBody>

                                    )}
                                </Droppable>
                            </DragDropContext>

                            <div className="px-5 my-3">
                                <Button
                                    onClick={() => {
                                        openModal({
                                            name: ModalTypes.MEMO_SERIES_ADD
                                        })
                                    }}
                                    className="w-full h-fit bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 p-1 rounded
                                text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                                >
                                    <RiAddLine className="w-6 h-6"/>
                                    <span className="p-1 font-semibold">포스트 추가</span>
                                </Button>
                            </div>
                        </Table>
                    </div>

                    <DialogFooter className="flex-row flex justify-center sm:justify-center space-x-3 sm:space-x-3">
                        <DialogClose asChild>
                            <Button
                                className="w-auto bg-primary hover:bg-primary-hover focus-visible:ring-0 focus-visible:ring-offset-0"
                                type="submit"
                            >
                                저장
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button
                                onClick={() => {
                                    closeModal({name: ModalTypes.MEMO_SERIES})
                                }}
                                type="button"
                                variant="secondary"
                                className="hover:bg-secondary-hover"
                            >
                                닫기
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <MemoSeriesManagementPage__MemoSeriesAddModal/>
        </>
    )
}

export default MemoSeriesManagementPage__MemoSeriesModal