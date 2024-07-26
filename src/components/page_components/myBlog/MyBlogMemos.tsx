'use client'

import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {faker} from "@faker-js/faker";

interface MyBlogMemosProps {
    username: string;
}

const MyBlogMemos = ({username}: MyBlogMemosProps) => {

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

    return (
        <div className="flex flex-1 flex-col bg-background rounded">
            {fakeDatas.map((fakeData, index) => {
                return (
                    <Link key={index}
                          href={`/@${username}/memos/${fakeData.memoId}`}
                          className="flex justify-between h-[150px] md:h-[220px] bg-transparent hover:bg-secondary cursor-pointer p-5">
                        <div
                            className="flex flex-col flex-1 justify-between mr-2">
                            <div>
                                <div
                                    className="text-lg md:text-2xl font-bold line-clamp-1 md:line-clamp-none">{fakeData.title}</div>
                                <div
                                    className="text-sm md:text-md font-semibold text-gray-500 dark:text-gray-400 line-clamp-2">{fakeData.summary}</div>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <div className="hidden md:flex">
                                    {fakeData.tags?.map((tag: string) => {
                                        return (
                                            <>
                                                {tag.length <= 9 &&
                                                    <Badge
                                                        className="bg-primary mr-1">{tag}</Badge>
                                                }
                                            </>
                                        );
                                    })}
                                </div>

                                <div className="flex">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 tracking-wider">
                                        {fakeData.createdAt &&
                                            new Date(fakeData.createdAt).toLocaleDateString('en-CA', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            }).replace(/-/g, '.')
                                        }
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
        </div>
    )
}

export default MyBlogMemos;