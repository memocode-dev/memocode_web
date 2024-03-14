import {useParams} from "react-router-dom";
import UpToDownButton from "@/components/common/UpToDownButton.tsx";
import Title from "@/components/postDetail/Title.tsx";
import Content from "@/components/postDetail/Content.tsx";
import BeforePostButton from "@/components/postDetail/BeforePostButton.tsx";
import AfterPostButton from "@/components/postDetail/AfterPostButton.tsx";
import Comment from "@/components/postDetail/Comment.tsx";
import {useFindPost} from "@/openapi/memo/api/post/post.ts";

const Post = () => {
    const {postId} = useParams();

    const {data: post} = useFindPost(postId!, {
        query: {
            queryKey: ['Post', postId],
        }
    });

    return (
        <div
            className="flex flex-1 bg-white py-20 overflow-y-auto mx-5 sm:mx-[50px] md:mx-[100px] lg:mx-[150px] xl:mx-[250px] 2xl:mx-[400px]">
            <UpToDownButton direction="up"/>

            {/*<InterestCard/>*/}
            <div className="flex-1 w-full">
                <Title post={post!}/>
                <Content post={post!}/>

                <div className="flex flex-1 bg-white">
                    <BeforePostButton/>
                    <AfterPostButton/>
                </div>

                <Comment/>
            </div>

            <UpToDownButton direction="down"/>
        </div>

    )
}

export default Post