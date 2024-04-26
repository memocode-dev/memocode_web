import {useParams} from "react-router-dom";
import Title from "@/components/post/Title.tsx";
import Content from "@/components/post/Content.tsx";
import BeforePostButton from "@/components/post/BeforePostButton.tsx";
import AfterPostButton from "@/components/post/AfterPostButton.tsx";
import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import CreateComment from "@/components/post/CreateComment.tsx";
import Comments from "@/components/post/Comments.tsx";
import {useFindMemo} from "@/openapi/api/memos/memos.ts";

const Post = () => {
    const {postId, username} = useParams();

    if (!/^@[a-z\d]+$/.test(username as string)) {
        throw new Error();
    }

    const {data: post} = useFindMemo(postId!, {
        query: {
            queryKey: ['Post', postId!],
        }
    });

    return (
        <div
            className="flex flex-1 bg-background pt-32 overflow-y-auto mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[320px] 2xl:mx-[400px]">

            <div className="flex-1 w-full">
                <Title post={post!}/>
                <Content post={post!}/>

                <div className="flex flex-1 bg-background py-10">
                    <BeforePostButton/>
                    <AfterPostButton/>
                </div>

                <CreateComment/>
                <Comments/>
            </div>

            <UpToDownButton direction="up"/>
        </div>

    )
}

export default Post