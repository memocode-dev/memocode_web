import {faker} from "@faker-js/faker";
import timeSince from "@/components/utils/timeSince.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {TbCaretUpDownFilled} from "react-icons/tb";

const MyBlogSeriesDetail = () => {

    const navigate = useNavigate()
    const {username} = useParams()
    const formattedUsername = username?.replace(/^@/, "") // @ 제거
    const {seriesTitle} = useParams<{ seriesTitle: string }>()
    const [order, setOrder] = useState(false) // false : 오름차순, true : 내림차순

    const generateData = (numItems: number) => Array.from({length: numItems}, () => {
        const createdAt = faker.date.past(2); // 과거 2년 내의 날짜
        const updatedAt = new Date(createdAt.getTime() + faker.datatype.number({
            min: 24 * 60 * 60 * 1000,
            max: 365 * 24 * 60 * 60 * 1000
        })); // createdAt으로부터 최소 1일에서 최대 365일 뒤

        return {
            title: faker.lorem.sentence(),
            summary: faker.lorem.paragraph(),
            img: faker.image.imageUrl(),
            totalPost: faker.datatype.number({min: 1, max: 100}),
            postId: faker.number,
            createdAt,
            updatedAt
        };
    });

    const fakeDatas = generateData(10);

    // order 상태에 따라 데이터 오름차순/내림차순 정렬
    const sortedFakeDatas = order
        ? [...fakeDatas].reverse() // 내림차순
        : fakeDatas; // 오름차순 (기본)

    return (
        <div
            className="flex flex-1 mt-20 bg-background overflow-y-auto mx-3 sm:mx-[50px] lg:mx-[120px] xl:mx-[280px] 2xl:mx-[420px]">
            <div className="flex-1 bg-transparent">
                <div
                    className="flex flex-col bg-gray-100 dark:bg-neutral-700 py-3 text-center mb-10 cursor-default">
                    <span className="text-md sm:text-xl font-bold">시리즈</span>
                    <span className="text-xl sm:text-3xl font-extrabold">{seriesTitle}</span>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            setOrder(prev => !prev)
                        }}
                        className="flex items-center w-fit h-fit px-2 py-1.5 rounded bg-primary hover:bg-primary-hover space-x-1 mb-5">
                        <TbCaretUpDownFilled className="w-3 h-3 sm:w-4 sm:h-4"/>
                        <div className="text-xs sm:text-sm font-semibold tracking-wider">{order ? '내림차순' : '오름차순'}</div>
                    </Button>
                </div>

                {sortedFakeDatas.map((fakeData, index) => {
                    return (
                        <div
                            onClick={() => {
                                navigate(`/@${formattedUsername}/${fakeData.postId}`)
                            }}
                            key={index}
                            className="flex justify-between h-[150px] md:h-[220px] bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer p-3">
                            <div className="flex flex-col flex-1 justify-between border-b border-b-gray-300 mr-2">
                                <div>
                                    <div
                                        className="text-lg md:text-2xl font-bold line-clamp-1 md:line-clamp-none">
                                        <span>{order ? fakeDatas.length - index : index + 1}. {fakeData.title}</span>
                                    </div>
                                    <div
                                        className="text-sm md:text-xl font-semibold text-gray-500 dark:text-gray-400 line-clamp-2">{fakeData.summary}</div>
                                </div>

                                <div className="flex justify-between">
                                    <div
                                        className="space-x-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        <span>{fakeData.createdAt.getFullYear()}년</span>
                                        <span>{(fakeData.createdAt.getMonth() + 1).toString().padStart(2)}월</span>
                                        <span>{fakeData.createdAt.getDate().toString().padStart(2)}일</span>
                                    </div>

                                    <div
                                        className="space-x-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        <span>{timeSince(new Date(fakeData.updatedAt!))} 수정됨</span>
                                    </div>
                                </div>
                            </div>

                            {fakeData.img &&
                                <img src={fakeData.img} className="hidden sm:flex w-[150px] md:w-[220px] h-full"/>}

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MyBlogSeriesDetail