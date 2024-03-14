import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {PostDetailDTO} from "@/openapi/memo/model";

const Title = ({post}: { post: PostDetailDTO }) => {
    return (
        <div className="bg-white border-b border-b-gray-300 p-5">
            <div className="text-5xl font-bold leading-snug break-all truncate">
                {post?.title}
            </div>

            <div className="flex justify-between items-center mt-10">
                <div className="flex items-center space-x-1.5">
                    <Avatar className="w-7 h-7">
                        <AvatarImage src="https://github.com/shadcn.png"/>
                        <AvatarFallback>
                            <Skeleton className="h-12 w-12 rounded-full"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="tracking-wider">{post?.authorDTO?.username}</div>
                </div>

                <div>
                    <div className="text-gray-500 tracking-wider">{post?.createdAt}</div>
                </div>
            </div>
        </div>
    )
}

export default Title
