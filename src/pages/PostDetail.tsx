import {useLocation} from "react-router-dom";
import UpToDownBtn from "@/components/common/UpToDownBtn.tsx";
import Title from "@/components/postDetail/Title.tsx";
import Content from "@/components/postDetail/Content.tsx";
import BeforePost from "@/components/postDetail/BeforePost.tsx";
import AfterPost from "@/components/postDetail/AfterPost.tsx";
import Comment from "@/components/postDetail/Comment.tsx";

const PostDetail = () => {

    const location = useLocation();
    const {item} = location.state;

    return (
        <div
            className="flex flex-1 bg-white py-20 overflow-y-auto mx-5 sm:mx-[50px] md:mx-[100px] lg:mx-[150px] xl:mx-[250px] 2xl:mx-[400px]">
            <UpToDownBtn direction="up"/>

            {/*<InterestCard/>*/}
            <div className="flex-1 w-full">
                <Title item={item}/>
                <Content item={item}/>

                <div className="flex flex-1 bg-white">
                    <BeforePost/>
                    <AfterPost/>
                </div>

                <Comment/>
            </div>

            <UpToDownBtn direction="down"/>
        </div>

    )
}

export default PostDetail