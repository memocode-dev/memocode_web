import {useLocation} from "react-router-dom";
import UpToDownButton from "@/components/common/UpToDownButton.tsx";
import Title from "@/components/postDetail/Title.tsx";
import Content from "@/components/postDetail/Content.tsx";
import BeforePostButton from "@/components/postDetail/BeforePostButton.tsx";
import AfterPostButton from "@/components/postDetail/AfterPostButton.tsx";
import Comment from "@/components/postDetail/Comment.tsx";

const Post = () => {

    const location = useLocation();
    const {item} = location.state;

    return (
        <div
            className="flex flex-1 bg-white py-20 overflow-y-auto mx-5 sm:mx-[50px] md:mx-[100px] lg:mx-[150px] xl:mx-[250px] 2xl:mx-[400px]">
            <UpToDownButton direction="up"/>

            {/*<InterestCard/>*/}
            <div className="flex-1 w-full">
                <Title item={item}/>
                <Content item={item}/>

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