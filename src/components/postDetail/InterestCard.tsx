import LikeHover from "@/components/common/postDetail/interestCards/LikeHover.tsx";
import ViewHover from "@/components/common/postDetail/interestCards/ViewHover.tsx";
import CommentHover from "@/components/common/postDetail/interestCards/CommentHover.tsx";

const InterestCard = () => {

    return (
        <div className="sticky z-40 top-0 -left-10 flex flex-col space-y-7">

            {/* 좋아요 수 */}
            <LikeHover/>

            {/* 조회 수 */}
            <ViewHover/>

            {/* 코멘트 수 */}
            <CommentHover/>

        </div>
    )
}

export default InterestCard