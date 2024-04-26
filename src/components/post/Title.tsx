import {PostDetailDTO} from "@/openapi/memo/model";
import Avatar from "react-avatar";

const Title = ({post}: { post: PostDetailDTO }) => {
    return (
        <div className="bg-background border-b border-b-gray-300 pb-1">
            <div className="text-2xl sm:text-4xl font-bold leading-snug break-all">
                {post?.title}
            </div>

            <div className="flex justify-between items-center mt-7">
                <div className="flex items-center space-x-1.5">
                    <Avatar
                        name={post?.author?.username}
                        size="25"
                        round="5px"/>
                    <div className="tracking-wider">{post?.author?.username}</div>
                </div>

                <div>
                    <div className="text-gray-500 dark:text-gray-300 tracking-wider">
                        {post?.createdAt
                            ? new Date(post?.createdAt).toLocaleDateString('en-CA', {
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
