import {faker} from "@faker-js/faker";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import MemoSeries from "@/components/memos/series/MemoSeries.tsx";

const MemoSeriess = () => {

    const {openModal} = useContext(ModalContext)

    // 가짜 데이터 생성
    const generateData = (numItems: number) => Array.from({length: numItems}, () => {
        const updatedAt = faker.date.past(2); // 과거 2년 내의 날짜

        return {
            title: faker.lorem.sentence(),
            totalPost: faker.datatype.number({min: 1, max: 100}),
            updatedAt,
        };
    });

    const fakeDatas = generateData(20);

    return (
        <>
            <div className="flex-1 flex flex-col mt-12 mx-3 sm:mx-10">
                <div
                    className="flex flex-col bg-transparent cursor-default">
                    <span className="text-lg sm:text-2xl font-bold">시리즈 관리</span>
                    <span className="text-sm sm:text-lg text-gray-500 dark:text-gray-300">
                    비슷한 주제나 연관된 내용을 가진 메모들을 시리즈로 묶어 관리해보세요.
                    </span>
                </div>

                <div className="flex-1 bg-transparent py-10 cursor-default">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-b-gray-200 dark:border-b-neutral-600">
                                <TableHead className="text-center">번호</TableHead>
                                <TableHead className="text-center">시리즈 제목</TableHead>
                                <TableHead className="text-center">포스트 수</TableHead>
                                <TableHead className="text-center">업데이트</TableHead>
                                <TableHead className="text-center">관리</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {fakeDatas.map((fakeData, index) => (
                                <TableRow key={index} className="border-b border-b-gray-200 dark:border-b-neutral-600">
                                    <TableCell className="text-center p-2">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="p-2">
                                        {fakeData.title}
                                    </TableCell>
                                    <TableCell className="text-center p-2">
                                        {fakeData.totalPost}
                                    </TableCell>
                                    <TableCell className="flex flex-col text-center p-2">
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
                                    <TableCell className="text-center space-y-1 space-x-1 p-2">
                                        <Button
                                            onClick={() => {
                                                openModal({
                                                    name: ModalTypes.MEMO_SERIES
                                                })
                                            }}
                                            className="w-fit h-7 bg-primary hover:bg-primary-hover">
                                            수정하기
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <MemoSeries/>
        </>
    )
}

export default MemoSeriess