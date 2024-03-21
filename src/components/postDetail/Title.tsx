import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {PostDetailDTO} from "@/openapi/memo/model";

const Title = ({post}: { post: PostDetailDTO }) => {
    return (
        <div className="bg-white dark:bg-[#1E1E1E] border-b border-b-gray-300 p-5">
            <div className="text-4xl font-bold leading-snug break-all">
                {post?.title}
            </div>

            <div className="flex justify-between items-center mt-10">
                <div className="flex items-center space-x-1.5">
                    <Avatar className="h-7 w-7 rounded">
                        <AvatarImage src="https://github.com/shadcn.png"/>
                        <AvatarFallback>
                            <Skeleton className="h-7 w-7 rounded"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="tracking-wider">{post?.author?.username}</div>
                </div>

                <div>
                    <div className="text-gray-500 dark:text-gray-300 tracking-wider">
                        {post?.createdAt
                            ? new Date(post.createdAt).toLocaleDateString('en-CA', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).replace(/-/g, '.')
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Title
