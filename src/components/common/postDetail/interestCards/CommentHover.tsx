import {useState} from "react";
import {AiOutlineComment} from "react-icons/ai";

const CommentHover = () => {

    const [commentHover, setCommentHover] = useState<boolean>(false)

    const handleClickComment = () => {
        console.log("댓글창으로 이동하기")
    }

    return (
        <div className="flex items-center space-x-2">
            <div
                onMouseOver={() => {
                    setCommentHover(true)
                }}
                onMouseOut={() => {
                    setCommentHover(false)
                }}
                onClick={handleClickComment}
                className="cursor-pointer"
            >
                <AiOutlineComment className="w-11 h-11"/>
            </div>

            {commentHover ? <div className="text-xl font-semibold">777</div> : ""}
        </div>
    )
}

export default CommentHover