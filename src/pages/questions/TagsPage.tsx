import {useLocation, useNavigate} from "react-router-dom";
import {useSearchQuestion} from "@/openapi/api/questions/questions.ts";
import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import {FaTag} from "react-icons/fa6";

const TagsPage = () => {

    const navigate = useNavigate()
    const {pathname} = useLocation()
    const lastPath = pathname.substring(pathname.lastIndexOf("/") + 1);
    const [sort, setSort] = useState<string>()

    const {
        data: tagsDatas
    } = useSearchQuestion({}, {
        query: {
            queryKey: ['TagsPage'],
        }
    });

    const tags = tagsDatas?.content?.map((tagsData) => (tagsData.tags))

    // 모든 배열을 하나로 합침, acc는 이전까지의 배열/curr은 현재 배열
    const mergedArray = tags?.reduce((acc, curr) => [...acc!, ...curr!], []);

    // 중복을 제거한 새로운 배열
    const nonDuplicateTags = Array.from(new Set(mergedArray));

    // 단어 등장 횟수를 카운트할 빈 객체 생성
    const count: Record<string, number> = {};

    // 단어 등장 횟수 카운트
    mergedArray?.forEach(word => {
        count[word] = (count[word] || 0) + 1;
    });

    // count 객체의 각 속성을 배열로 변환
    const countArray = Object.entries(count);

    useEffect(() => {
        if (pathname) {
            setSort(lastPath)
        }
    }, [pathname]);

    const TagsPage__TagsSortButton = (
        <div defaultValue={sort} className="cursor-pointer">
            <div className="flex space-x-2">
                <div
                    className={`rounded py-1 px-3 text-sm
                                 ${sort === "popular" || pathname === "/tags" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/tags/popular`);
                        setSort("popular");
                    }}>
                    인기순
                </div>
                <div
                    className={`rounded py-1 px-3 text-sm
                                ${sort === "name" ? `bg-gray-200 text-black dark:bg-neutral-500 dark:text-white` : `bg-gray-100 text-gray-500 dark:bg-neutral-700 dark:text-gray-400`}`}
                    onClick={() => {
                        navigate(`/tags/name`);
                        setSort("name");
                    }}>
                    이름순
                </div>
            </div>
        </div>
    )

    return (
        <>
            <div className="flex items-center mt-5">
                {/* 정렬 버튼 */}
                {TagsPage__TagsSortButton}
            </div>

            <div className="flex flex-wrap">
                {nonDuplicateTags?.map((nonDuplicateTag, index) => {
                    return (
                        <HoverCard
                            openDelay={200}
                            closeDelay={10}
                        >
                            <HoverCardTrigger
                                key={index} asChild
                                className="mt-10"
                                onClick={() => {
                                    console.log("Dd")
                                }}
                            >
                                <Button variant={null}>
                                    <Badge
                                        className="w-fit h-fit text-xl px-3 py-2 text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600">{nonDuplicateTag}</Badge>
                                </Button>
                            </HoverCardTrigger>

                            <HoverCardContent className="w-fit text-gray-500 bg-background border border-gray-100 mt-5">
                                <div className="flex flex-col">
                                    <span>{nonDuplicateTag} 관련 질문은 {countArray.reduce((acc, [wordName, count]) => wordName === nonDuplicateTag ? count : acc, 0)}개입니다.</span>

                                    <div className="flex tracking-wider">
                                        <div className="flex items-center text-gray-950 font-semibold">
                                            <span>태그</span>
                                            <FaTag/>
                                        </div>
                                        <div>를 클릭하여 질문을 확인해보세요!</div>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    )
                })}
            </div>
        </>
    )
}

export default TagsPage