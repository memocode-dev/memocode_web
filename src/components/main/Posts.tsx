import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {useFindAllPostInfinite} from "@/openapi/memo/api/post/post.ts";
import {Button} from "@/components/ui/button.tsx";

const Posts = () => {

    const navigate = useNavigate();

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

    console.log("posts", posts);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {posts?.pages.map((item) => (
                    item?.content?.map(post => {
                        return (
                            <div key={post.id}
                                 className="flex flex-col flex-1 rounded-lg bg-[#F1F2F4] dark:bg-neutral-800 hover:cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                                 onClick={() => {
                                     navigate(`/posts/${post.id}`, {state: {post}})
                                 }}
                            >
                                <img
                                    src="https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
                                    className="rounded-lg w-auto h-[60%]" alt="thumbNail"/>

                                <div className="flex-1 flex flex-col py-2 px-3">
                                    <div>
                                        <div className="text-lg">{post.title}</div>
                                        <div className="text-sm">{post.content?.substring(0, 50)}...</div>
                                    </div>

                                    <div className="flex items-center mt-4 text-xs">
                                        <div className="flex items-center space-x-1.5">
                                            <Avatar className="w-6 h-6 rounded">
                                                <AvatarImage src="https://github.com/shadcn.png"/>
                                                <AvatarFallback>
                                                    <Skeleton className="w-6 h-6 rounded"/>
                                                </AvatarFallback>
                                            </Avatar>

                                            <div>{post.author?.username}</div>

                                            <div className="text-gray-500 dark:text-gray-400">3일 전</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xs mt-3">
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
                        )
                    })

                ))}
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

export default Posts