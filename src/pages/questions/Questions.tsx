import QuestionsSideBar from "@/components/questions/QuestionsSideBar.tsx";
import {GiHand} from "react-icons/gi";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {BiSearch} from "react-icons/bi";
import {useFindAllQuestionInfinite} from "@/openapi/question/api/questions/questions.ts";

const Questions = () => {

    const {
        data: questions,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFindAllQuestionInfinite({
        size: 10
    }, {
        query: {
            queryKey: ['Questions'],
            getNextPageParam: (lastPage) => {
                if (!lastPage.last) {
                    return lastPage.currentPage! + 1;
                }
            },
        }
    });

    console.log("questions", questions)

    return (
        <>
            <div
                className="flex flex-1 mt-[65px] bg-white dark:bg-[#1E1E1E] overflow-y-auto mx-5 sm:mx-[50px] md:mx-[100px] lg:mx-[150px] xl:mx-[250px] 2xl:mx-[400px]">

                {/* 사이드 바 */}
                <QuestionsSideBar/>

                <div className="bg-transparent flex flex-1 flex-col p-3">
                    <div className="flex justify-end">
                        <Button
                            className="flex items-center w-fit h-fit p-2 rounded bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white space-x-1">
                            <div className="text-sm font-semibold">질문하기</div>
                            <GiHand className="w-5 h-5"/>
                        </Button>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center bg-transparent space-y-10 mt-5">
                        <div className="flex w-full items-center space-x-3 relative">
                            <Input type="text"
                                   className="text-lg py-6 pl-10 placeholder:text-gray-700 placeholder:dark:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0
                               bg-gray-100 dark:bg-neutral-700 border-0 dark:border-neutral-800 shadow-lg dark:shadow-black/20"
                                   placeholder="검색"/>

                            <BiSearch className="absolute w-6 h-6 text-gray-700 dark:text-gray-300"/>
                        </div>

                        <div className="flex flex-col bg-indigo-100 p-5 border-b border-b-gray-500">
                            <div>title</div>
                            <div>content...</div>
                            <div>tag</div>
                            <div className="flex">
                                <div>author</div>
                                <div>3분전</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {hasNextPage && (
                <div className="flex mt-4">
                    <Button className="flex-1" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                        {isFetchingNextPage ? '불러오는 중' : '더보기'}
                    </Button>
                </div>
            )}
        </>
    )
}

export default Questions