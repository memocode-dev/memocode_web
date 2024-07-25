// 'use client'
//
// import {Badge} from "@/components/ui/badge";
// import {AiFillLike, AiOutlineComment} from "react-icons/ai";
// import {IoGlasses} from "react-icons/io5";
// import {faker} from "@faker-js/faker";
// import {usePathname} from "next/navigation";
// import Link from "next/link";
// import {Tabs, TabsContent} from "@/components/ui/tabs";
//
// const MyBlogMemos = () => {
//
//     const pathname = usePathname()
//     const username = pathname?.replace(/^\/@/, ""); // /@제거
//
//     // 함수로 가짜 데이터 객체 생성
//     function createFakeData() {
//         return {
//             title: faker.lorem.sentence(),
//             summary: faker.lorem.text().substring(0, 100),
//             createdAt: faker.date.past().toISOString(),
//             view: faker.datatype.number({min: 0, max: 10000}),
//             like: faker.datatype.number({min: 0, max: 5000}),
//             comment: faker.datatype.number({min: 0, max: 1000}),
//             tags: Array.from({length: faker.datatype.number({min: 1, max: 5})}, () => faker.random.word()),
//             thumbnail: faker.image.imageUrl(),
//             memoId: "135a243e-b579-4f42-ae38-858f5ded6260"
//             // thumbnail:""
//         };
//     }
//
//     // 가짜 데이터 객체를 담은 배열 생성
//     const fakeDatas = Array.from({length: 15}, createFakeData);
//
//     return (
//         <Tabs>
//             <TabsContent value="memos" className="flex flex-1 flex-col bg-secondary rounded">
//                 {fakeDatas.map((fakeData, index) => {
//                     return (
//                         <Link key={index}
//                               href={`/@${username}/memos/${fakeData.memoId}`}
//                               className="flex justify-between h-[150px] md:h-[220px] bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-900 cursor-pointer p-3">
//                             <div className="flex flex-col flex-1 justify-between border-b border-b-gray-300 mr-2">
//                                 <div>
//                                     <div
//                                         className="text-lg md:text-2xl font-bold line-clamp-1 md:line-clamp-none">{fakeData.title}</div>
//                                     <div
//                                         className="text-sm md:text-xl font-semibold text-gray-500 dark:text-gray-400 line-clamp-2">{fakeData.summary}</div>
//                                 </div>
//
//                                 <div className="hidden md:flex">
//                                     {fakeData.tags?.map((tag: string) => {
//                                         return (
//                                             <>
//                                                 {tag.length <= 9 &&
//                                                     <Badge
//                                                         className="mt-3 text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mr-1">{tag}</Badge>
//                                                 }
//                                             </>
//                                         );
//                                     })}
//                                 </div>
//
//                                 <div className="flex justify-between">
//                                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                                         {fakeData.createdAt &&
//                                             new Date(fakeData.createdAt).toLocaleDateString('en-CA', {
//                                                 year: 'numeric',
//                                                 month: '2-digit',
//                                                 day: '2-digit'
//                                             }).replace(/-/g, '.')
//                                         }
//                                     </div>
//
//                                     <div className="flex items-center text-xs space-x-1.5">
//                                         <div
//                                             className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
//                                             <AiFillLike className="w-3.5 h-3.5"/>
//                                             <span>{fakeData.like}</span>
//                                         </div>
//
//                                         <div className="text-gray-400">|</div>
//                                         <div
//                                             className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
//                                             <IoGlasses className="w-5 h-5"/>
//                                             <span>{fakeData.view}</span>
//                                         </div>
//
//                                         <div className="text-gray-400">|</div>
//                                         <div
//                                             className="flex items-center space-x-0.5 text-gray-500 dark:text-gray-400">
//                                             <AiOutlineComment className="w-4 h-4"/>
//                                             <span>{fakeData.comment}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {fakeData.thumbnail &&
//                                 <img src={fakeData.thumbnail}
//                                      className="hidden sm:flex w-[150px] md:w-[220px] h-full"/>}
//
//                         </Link>
//                     )
//                 })}
//             </TabsContent>
//         </Tabs>
//     )
// }
//
// export default MyBlogMemos;