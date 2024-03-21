import QuestionsSideBar from "@/components/questions/QuestionsSideBar.tsx";
import {GiHand} from "react-icons/gi";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {BiSearch} from "react-icons/bi";
import {useFindAllQuestionInfinite} from "@/openapi/question/api/questions/questions.ts";
import {MdExpandMore} from "react-icons/md";
import {Badge} from "@/components/ui/badge.tsx";
import {faker} from '@faker-js/faker';
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import timeSince from "@/components/utils/timeSince.tsx";


function createFakeDataArray(dataCount: number): any[] {
    return Array.from({length: dataCount}, () => ({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(),
        createdAt: faker.date.past().toISOString(),
        author: faker.person.fullName(), // faker.person.fullName() 대신 faker.name.findName()을 사용
        tags: Array.from({length: 10}, () => faker.lorem.word()),
        likes: faker.number.int({min: 0, max: 500}),
        views: faker.number.int({min: 0, max: 5000}),
        answers: faker.number.int({min: 0, max: 50})
    }));
}

const Questions = () => {

    const {
        data: questions,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFindAllQuestionInfinite({
        pageable: {

        }
    }, {
        query: {
            queryKey: ['Questions'],
            getNextPageParam: (lastPage) => {
                if (!lastPage.last) {
                    return {
                        page: lastPage.number! + 1,
                    };
                }
            },
        }
    });

    console.log("questions", questions)

    // 가짜 데이터 생성 및 출력
    const fakeDataArray = createFakeDataArray(10);
    console.log(fakeDataArray);

    return (
        <div
            className="flex flex-1 flex-col mt-[65px] bg-white dark:bg-[#1E1E1E] overflow-y-auto mx-5 sm:mx-[50px] md:mx-[100px] lg:mx-[150px] xl:mx-[250px] 2xl:mx-[400px]">

            {/* 사이드 바 */}
            <QuestionsSideBar/>

            <div className="bg-transparent flex flex-1 flex-col p-3">
                {/* 질문하기 */}
                <div className="flex justify-end">
                    <Button
                        className="flex items-center w-fit h-fit p-2 rounded bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white space-x-1">
                        <div className="text-sm font-semibold">질문하기</div>
                        <GiHand className="w-5 h-5"/>
                    </Button>
                </div>

                {/* 검색 */}
                <div className="flex w-full py-5 items-center space-x-3 relative">
                    <Input type="text"
                           className="text-lg py-6 pl-10 placeholder:text-gray-700 placeholder:dark:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0
                               bg-gray-100 dark:bg-neutral-700 border-0 dark:border-neutral-800 shadow-lg dark:shadow-black/20"
                           placeholder="검색"/>

                    <BiSearch className="absolute w-6 h-6 text-gray-700 dark:text-gray-300"/>
                </div>

                {/* Q&A 목록 */}
                <div className="flex flex-1 flex-col justify-start bg-transparent">
                    {fakeDataArray.map((fakeData, index) => {
                        return (
                            <div key={index}
                                 className="flex flex-col w-full bg-transparent p-2 sm:p-3 border-b border-b-gray-300">

                                <div className="flex flex-col">
                                    <div className="text-xl font-semibold">{fakeData.title}</div>
                                    <div>{fakeData.content?.substring(0, 100)}...</div>
                                </div>

                                <div className="mt-2">
                                    <div className="hidden sm:flex">
                                        {fakeData.tags.map((tag: string) => {
                                            return (
                                                <div className="">
                                                    {tag.length <= 9 &&
                                                        <Badge
                                                            className="text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1">{tag}</Badge>
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center justify-between mt-1 px-1">
                                        <div className="flex text-sm justify-end space-x-1">
                                            <div>{fakeData.author}</div>
                                            <div
                                                className="text-gray-500 dark:text-gray-400">{timeSince(new Date(fakeData.createdAt))}</div>
                                        </div>
                                        <div className="flex text-sm space-x-1.5">
                                            <div className="flex items-center space-x-0.5">
                                                <AiFillLike className="w-4 h-4"/>
                                                <span>{fakeData.likes}</span>
                                            </div>
                                            <div className="text-gray-400">|</div>
                                            <div className="flex items-center space-x-0.5">
                                                <IoGlasses className="w-6 h-6"/>
                                                <span>{fakeData.views}</span>
                                            </div>
                                            <div className="text-gray-400">|</div>
                                            <div className="flex items-center space-x-0.5">
                                                <AiOutlineComment className="w-5 h-5"/>
                                                <span>{fakeData.answers}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {hasNextPage && (
                <div className="flex my-2">
                    <Button
                        className="flex-1 bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-800 dark:text-gray-200"
                        onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? '불러오는 중' : <MdExpandMore className="w-7 h-7"/>}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Questions