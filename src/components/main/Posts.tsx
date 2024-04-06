import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {useFindAllPostInfinite} from "@/openapi/memo/api/post/post.ts";
import {Button} from "@/components/ui/button.tsx";
import {MdExpandMore} from "react-icons/md";
import timeSince from "@/components/utils/timeSince.tsx";
import DOMPurify from "dompurify";
import Avatar from "react-avatar";
import {useContext} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const Posts = () => {

    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext)

    const thumbnail = "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
    // const thumbnail = ""


    const {
        data: posts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useFindAllPostInfinite({}, {
        query: {
            queryKey: ['Posts'],
            getNextPageParam: (lastPage) => {
                if (!lastPage.last) {
                    return lastPage.number! + 1;
                }
            },
        }
    });

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {posts?.pages.map((item) => (
                    item?.content?.map(post => {
                        return (
                            <div key={post.id}
                                 className="flex flex-col h-[310px] scale-100 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                                 onClick={() => {
                                     navigate(`/@${post?.author?.username}/${post.id}`)
                                 }}
                            >
                                {thumbnail &&
                                    <>
                                        <img
                                            src={thumbnail}
                                            className="rounded-lg w-auto h-[50%]" alt="thumbNail"/>

                                        <div className="flex-1 flex flex-col justify-between py-2 px-3">
                                            <div className="h-[70px]">
                                                <div
                                                    className="text-lg font-semibold tracking-tight line-clamp-1">{post.title}</div>
                                                <div className="markdown-body tracking-wide line-clamp-2"
                                                     style={{fontSize: 14, marginTop: 4}}
                                                     dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.content || "")}}></div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex items-center text-xs">
                                                    <div className="flex items-center space-x-1.5">
                                                        <Avatar
                                                            name={post.author?.username}
                                                            size="25"
                                                            round="5px"/>

                                                        <div>{post.author?.username}</div>

                                                        <div
                                                            className="text-gray-500 dark:text-gray-400">{timeSince(new Date(post.createdAt!))}</div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-between text-xs mt-1">
                                                    <div className="flex space-x-2">
                                                        <div className="flex items-center space-x-1">
                                                            <AiFillLike className="w-4 h-4"/>
                                                            <div>0</div>
                                                        </div>

                                                        <div className="flex items-center space-x-1">
                                                            <IoGlasses className="w-6 h-6"/>
                                                            <div>0</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-1">
                                                        <AiOutlineComment className="w-5 h-5"/>
                                                        <div>0</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                                {!thumbnail &&
                                    <div className="flex-1 flex flex-col justify-between py-2 px-3">
                                        <div className="">
                                            <div
                                                className="text-lg font-semibold tracking-tight line-clamp-2">{post.title}</div>
                                            <div
                                                className="text-md mt-2 tracking-tight line-clamp-2 text-gray-600 dark:text-gray-400">summary
                                            </div>
                                            <div className="markdown-body tracking-wide line-clamp-6"
                                                 style={{
                                                     fontSize: 14,
                                                     marginTop: 4,
                                                     color: `${theme === "dark" ? "#9ca3af" : "#6b7280"}`
                                                 }}
                                                 dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(post.content || "")}}></div>
                                        </div>

                                        <div className="mt-3">
                                            <div className="flex items-center text-xs">
                                                <div className="flex items-center space-x-1.5">
                                                    <Avatar
                                                        name={post.author?.username}
                                                        size="25"
                                                        round="5px"/>

                                                    <div>{post.author?.username}</div>

                                                    <div
                                                        className="text-gray-500 dark:text-gray-400">{timeSince(new Date(post.createdAt!))}</div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-xs mt-1">
                                                <div className="flex space-x-2">
                                                    <div className="flex items-center space-x-1">
                                                        <AiFillLike className="w-4 h-4"/>
                                                        <div>0</div>
                                                    </div>

                                                    <div className="flex items-center space-x-1">
                                                        <IoGlasses className="w-6 h-6"/>
                                                        <div>0</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-1">
                                                    <AiOutlineComment className="w-5 h-5"/>
                                                    <div>0</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })

                ))}
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
        </>

    )
}

export default Posts