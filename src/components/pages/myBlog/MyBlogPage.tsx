'use client'

import {usePathname} from "next/navigation";
import Avatar from "react-avatar";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Link from "next/link";
import {FaA, FaQ} from "react-icons/fa6";
import {Badge} from "@/components/ui/badge";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {faker} from "@faker-js/faker";

const MyBlogPage = () => {

    const pathname = usePathname()
    const username = pathname?.replace(/^\/@/, ""); // /@제거
    const [activeTab, setActiveTab] = useState('about');
    // const tabPath = pathname.split('/').filter(Boolean)[1] // /기준으로 tabPath 조회
    // const {user_info, isLogined} = useKeycloak();
    const [handleProfile, setHandleProfile] = useState(false)
    const [handleAddLink, sethandleAddLink] = useState(0)
    const updateProfile = useForm({
        defaultValues: {
            shortIntroduction: "",
            git: "",
            email: "",
            link_1: "",
            link_2: ""
        }
    });

    // 함수로 가짜 데이터 객체 생성
    function createFakeData() {
        return {
            title: faker.lorem.sentence(),
            summary: faker.lorem.text().substring(0, 100),
            createdAt: faker.date.past().toISOString(),
            view: faker.datatype.number({min: 0, max: 10000}),
            like: faker.datatype.number({min: 0, max: 5000}),
            comment: faker.datatype.number({min: 0, max: 1000}),
            tags: Array.from({length: faker.datatype.number({min: 1, max: 5})}, () => faker.random.word()),
            thumbnail: faker.image.imageUrl(),
            memoId: "135a243e-b579-4f42-ae38-858f5ded6260"
            // thumbnail:""
        };
    }

    // 가짜 데이터 객체를 담은 배열 생성
    const fakeDatas = Array.from({length: 15}, createFakeData);

    // 현재 URL을 '/'로 분할
    const parts = pathname.split('/');
    console.log("parts[parts.length - 1]", parts[parts.length - 1])

    const handleTab = (path: string) => {
        setActiveTab(path);

        // 현재 URL을 '/'로 분할
        const parts = pathname.split('/');

        // 현재 URL의 마지막 문자열이 @username이면 현재 URL 맨끝에 path 추가
        if (parts[parts.length - 1] === '@' + username) {
            const newUrl = `${pathname}/${path}`;
            typeof window !== 'undefined' && window.history.pushState({}, '', newUrl);
        } else {
            // 현재 URL의 마지막 문자열이 @username이 아니라면 현재 URL 맨끝 문자열을 path로 변경
            // 마지막 부분을 변경
            parts[parts.length - 1] = path;
            const newUrl = parts.join('/');
            typeof window !== 'undefined' && window.history.replaceState({}, '', newUrl);
        }
    };

    const TabButtons = (
        <TabsList className="grid w-full grid-cols-4 bg-secondary rounded h-auto p-1.5">
            {/* 내 소개 탭 버튼 */}
            <TabsTrigger
                value="about"
                className="data-[state=active]:bg-background hover:bg-background rounded"
                onClick={() => handleTab("about")}
            >
                <div>소개</div>
            </TabsTrigger>

            {/* 내 메모 탭 버튼 */}
            <TabsTrigger
                value="memos"
                className="data-[state=active]:bg-background hover:bg-background rounded"
                onClick={() => handleTab("memos")}
            >
                <div>메모</div>
            </TabsTrigger>

            {/* 내 시리즈 탭 버튼 */}
            <TabsTrigger
                value="series"
                className="data-[state=active]:bg-background hover:bg-background rounded"
            >
                <Link href={`/@${username}/series`}>시리즈</Link>
            </TabsTrigger>

            {/* 질문&답변 탭 버튼 */}
            <TabsTrigger
                value="q&a"
                className="data-[state=active]:bg-background hover:bg-background rounded"
            >
                <Link href={`/@${username}/q&a`} className="flex items-center">
                    <FaQ className="w-3.5 h-3.5 mr-0.5"/>
                    &
                    <FaA className="w-3.5 h-3.5 ml-0.5"/>
                </Link>
            </TabsTrigger>
        </TabsList>
    )

    return (
        <>
            <div className="flex flex-col flex-1 bg-secondary rounded p-6">
                <div className="profile_css">
                    <div className="avatar-size">
                        <Avatar
                            name={username}
                            size="100%"
                            round="5px"/>
                    </div>

                    <div className="userInfo_css"></div>
                    {/* 프로필 편집 버튼 */}
                    {/*{isLogined && user_info.username === formattedUsername && !handleProfile &&*/}
                    {/*    <TooltipProvider>*/}
                    {/*        <Tooltip delayDuration={100}>*/}
                    {/*            <TooltipTrigger className="absolute -right-1 top-0" asChild>*/}
                    {/*                <Button type="button" className="bg-transparent hover:bg-transparent">*/}
                    {/*                    <FaUserEdit*/}
                    {/*                        onClick={() => {*/}
                    {/*                            setHandleProfile(true)*/}
                    {/*                        }}*/}
                    {/*                        className="w-5 h-5 text-indigo-400 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500 cursor-pointer"/>*/}
                    {/*                </Button>*/}
                    {/*            </TooltipTrigger>*/}
                    {/*            <TooltipContent*/}
                    {/*                side="bottom"*/}
                    {/*                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">*/}
                    {/*                <p>프로필 편집</p>*/}
                    {/*            </TooltipContent>*/}
                    {/*        </Tooltip>*/}
                    {/*    </TooltipProvider>*/}
                    {/*}*/}

                    {/*프로필 편집 폼*/}
                    {/*<div className="flex flex-col flex-1 profile_edit">*/}
                    {/*    <span*/}
                    {/*        className="text-center sm:text-start text-3xl font-bold cursor-default">{formattedUsername}</span>*/}

                    {/*    /!* 프로필 값이 없다면 *!/*/}
                    {/*    {Object.values(updateProfile.getValues()).every(value => value === "") &&*/}
                    {/*        <>*/}
                    {/*            {isLogined && !handleProfile &&*/}
                    {/*                <div className="text-sm text-gray-400">*/}
                    {/*                    우측 상단 프로필 편집을 눌러 {user_info?.username}님의 소셜 정보를 등록해보세요!*/}
                    {/*                </div>*/}
                    {/*            }*/}
                    {/*        </>*/}
                    {/*    }*/}

                    {/*    {handleProfile &&*/}
                    {/*        <>{MyBlogPageLayout__ProfileEditForm}</>*/}
                    {/*    }*/}

                    {/*</div>*/}
                </div>
            </div>

            {/* 탭 버튼 */}
            <Tabs defaultValue={activeTab} className="my-2 w-full justify-center">
                {TabButtons}

                {activeTab &&
                    <TabsContent value={activeTab} className="flex flex-1 flex-col bg-secondary rounded">
                        {fakeDatas.map((fakeData, index) => {
                            return (
                                <Link key={index}
                                      href={`/@${username}/memos/${fakeData.memoId}`}
                                      className="flex justify-between h-[150px] md:h-[220px] bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer p-3">
                                    <div
                                        className="flex flex-col flex-1 justify-between border-b border-b-gray-300 mr-2">
                                        <div>
                                            <div
                                                className="text-lg md:text-2xl font-bold line-clamp-1 md:line-clamp-none">{fakeData.title}</div>
                                            <div
                                                className="text-sm md:text-xl font-semibold text-gray-500 dark:text-gray-400 line-clamp-2">{fakeData.summary}</div>
                                        </div>

                                        <div className="hidden md:flex">
                                            {fakeData.tags?.map((tag: string) => {
                                                return (
                                                    <>
                                                        {tag.length <= 9 &&
                                                            <Badge
                                                                className="mt-3 text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1">{tag}</Badge>
                                                        }
                                                    </>
                                                );
                                            })}
                                        </div>

                                        <div className="flex justify-between">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {fakeData.createdAt &&
                                                    new Date(fakeData.createdAt).toLocaleDateString('en-CA', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    }).replace(/-/g, '.')
                                                }
                                            </div>

                                            <div className="flex items-center text-xs space-x-1.5">
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <AiFillLike className="w-3.5 h-3.5"/>
                                                    <span>{fakeData.like}</span>
                                                </div>

                                                <div className="text-gray-400">|</div>
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <IoGlasses className="w-5 h-5"/>
                                                    <span>{fakeData.view}</span>
                                                </div>

                                                <div className="text-gray-400">|</div>
                                                <div
                                                    className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
                                                    <AiOutlineComment className="w-4 h-4"/>
                                                    <span>{fakeData.comment}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {fakeData.thumbnail &&
                                        <img src={fakeData.thumbnail}
                                             className="hidden sm:flex w-[150px] md:w-[220px] h-full"/>}

                                </Link>
                            )
                        })}
                    </TabsContent>
                }
            </Tabs>
        </>
    )
}

export default MyBlogPage;