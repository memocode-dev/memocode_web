import {useParams} from "react-router-dom";
import Title from "@/components/post/Title.tsx";
import Content from "@/components/post/Content.tsx";
import BeforePostButton from "@/components/post/BeforePostButton.tsx";
import AfterPostButton from "@/components/post/AfterPostButton.tsx";
import Comment from "@/components/post/Comment.tsx";
import {useFindPost} from "@/openapi/memo/api/post/post.ts";
import UpToDownButton from "@/components/ui/UpToDownButton.tsx";

const Post = () => {
    const {postId} = useParams();

    const {data: post} = useFindPost(postId!, {
        query: {
            queryKey: ['Post', postId],
        }
    });

    return (
        <div
            className="flex flex-1 bg-white dark:bg-[#1E1E1E] py-20 overflow-y-auto mx-2 sm:mx-[50px] md:mx-[100px] lg:mx-[150px] xl:mx-[250px] 2xl:mx-[400px]">
            <div className="flex-1 w-full">
                <Title post={post!}/>
                <Content post={post!}/>x

                <div className="flex flex-1 bg-white dark:bg-[#1E1E1E] ">
                    <BeforePostButton/>
                    <AfterPostButton/>
                </div>

                <Comment/>
            </div>

            <UpToDownButton direction="up"/>
        </div>

    )
}

export default Post