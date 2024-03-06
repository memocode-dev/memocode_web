import {useState} from "react";
import {AiFillLike} from "react-icons/ai";

const LikeHover = () => {

    const [likeHover, setLikeHover] = useState<boolean>(false)

    const handleClickLike = () => {
        console.log("like")
    }

    return (
        <div className="flex items-center space-x-2">
            <div
                onMouseOver={() => {
                    setLikeHover(true)
                }}
                onMouseOut={() => {
                    setLikeHover(false)
                }}
                onClick={handleClickLike}
                className="cursor-pointer"
            >
                <AiFillLike className="w-11 h-11"/>
            </div>

            {likeHover ? <div className="text-xl font-semibold">32</div> : ""}
        </div>
    )
}

export default LikeHover